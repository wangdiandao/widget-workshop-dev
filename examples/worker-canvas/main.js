(() => {
  let worker, sequence = 0, audio, frameRate = 30;
  let soundBusy=false,soundTone=null,soundGain=null,soundTimer=null,cancelSound=null;
  const lifecycleStops = new Set();
  let computing=false, computeTimer, presentationTimer, presentationInFlight=false, pendingPresentation=null, stopped=false, reportController=null;
  const computeButton=document.querySelector('#compute');
  const result = document.querySelector('#result');
  let scene = document.querySelector('#scene');
  let offscreen = false;
  let system = null;
  function updateSystem(value) {
    if(stopped)return;
    system = value;
    document.querySelector('#system').textContent = `系统偏好：${value.theme} / ${value.locale ?? '不可用'}；电源 ${value.power.source}，节能 ${value.power.energySaver ?? '不可用'}`;
    document.documentElement.dataset.theme = value.theme;
    updateActivity();
  }
  function start() {
    if(stopped)return false;
    let current;
    try {current=worker=new Worker('compute.js');}catch {cancel('计算不可用，请重试或重载组件');return false;}
    current.onmessage = ({data}) => {
      if(stopped||worker!==current)return;
      if(data.kind==='presentation') {
        clearTimeout(presentationTimer);presentationInFlight=false;
        document.querySelector('#drawing').textContent=`绘制：${data.mode} · ${data.frames} 帧 · 计时器 ${data.timerActive?'活动':'停止'}`;
        dispatchEvent(new CustomEvent('compute.presentation',{detail:data}));sendPresentation();return;
      }
      if (data.kind==='computed'&&computing&&data.id === sequence) {
        computing=false;clearTimeout(computeTimer);computeButton.disabled=false;
        result.textContent=data.error?'数值累计超出有限范围，请缩小输入':`数量 ${data.count}，总和 ${data.sum}，平均 ${data.mean}`;
      }
    };
    current.onerror = event => {event.preventDefault();if(worker===current)cancel('计算不可用，请重新计算或重载组件');};
    try {
    if (typeof scene.transferControlToOffscreen === 'function') {
      const canvas = scene.transferControlToOffscreen();
      worker.postMessage({kind: 'canvas', canvas}, [canvas]); offscreen = true;
    }
    if (widgetHost.context) updateActivity();
    }catch {cancel('画布不可用，请重新计算或重载组件');return false;}
    return true;
  }
  function stopWorker() {
    ++sequence;clearTimeout(computeTimer);clearTimeout(presentationTimer);
    const previous=worker;worker=null;
    if(previous){previous.onmessage=null;previous.onerror=null;previous.terminate();}
    computing=false;pendingPresentation=null;presentationInFlight=false;offscreen=false;
  }
  function cancel(message='已取消，可重新计算') {
    stopWorker();
    if(stopped)return;
    computeButton.disabled=false;
    const next = scene.cloneNode(); scene.replaceWith(next); scene = next;
    result.textContent = message;document.querySelector('#drawing').textContent='绘制已停止，可重新计算或重载';
    document.querySelector('#compatibility').textContent='Worker 画布已释放；重新计算可重建。';
  }
  function sendPresentation() {
    if(stopped||!worker||presentationInFlight||!pendingPresentation)return;
    const current=worker,state=pendingPresentation;pendingPresentation=null;presentationInFlight=true;
    presentationTimer=setTimeout(()=>{if(worker===current)cancel('绘制响应超时，请重新计算或重载组件');},5000);
    try {current.postMessage(state);}catch {cancel('绘制不可用，请重新计算或重载组件');}
  }
  start();
  function updateActivity() {
    if(stopped)return;
    const context=widgetHost.context;if(!context)return;
    const mode=!context.visible||document.hidden?'hidden':system?.sessionLocked===true||lifecycleStops.size?'paused':system?.reducedMotion?'static':'animated';
    pendingPresentation={kind:'presentation',mode,frameRate:system?.power.energySaver?Math.min(10,frameRate):frameRate};sendPresentation();
  }
  const off = widgetHost.on('visibility.changed',updateActivity);
  function configure(values) {
    if(stopped)return;
    frameRate = values.frameRate ?? 30;
    updateActivity();
    document.querySelector('#compatibility').textContent = `本机探测：WebGL2 ${!!gl} / Worker 画布 ${offscreen}。动画目标 ${frameRate} fps。`;
  }
  const offConfig = widgetHost.on('config.changed', configure);
  const offSystem = widgetHost.on('system.changed', updateSystem);
  const offLifecycle = widgetHost.on('lifecycle.changed', ({state}) => {
    if(stopped)return;
    if(state==='locked'||state==='suspending')lifecycleStops.add(state);
    if(state==='unlocked')lifecycleStops.delete('locked');
    if(state==='resumed')lifecycleStops.delete('suspending');
    updateActivity();document.querySelector('#lifecycle').textContent = `最近通知：${state}；不代表模拟暂停`;
  });
  document.addEventListener('visibilitychange',updateActivity);
  widgetHost.ready.then(context => { if(stopped)return;updateActivity(); configure(context.configuration); updateSystem(context.system); }).catch(() => {});
  const reportButton=document.querySelector('#report');
  reportButton.onclick = async () => {
    if(stopped||reportController)return;
    const operation=reportController=new AbortController();reportButton.disabled=true;
    try {
      const report=await widgetHost.compatibility({signal:operation.signal});
      if(!stopped&&!operation.signal.aborted)document.querySelector('#reportResult').textContent=JSON.stringify(report,null,2);
    } catch {if(!stopped&&!operation.signal.aborted)document.querySelector('#reportResult').textContent='报告不可用';}
    finally {reportController=null;if(!stopped)reportButton.disabled=false;}
  };
  const gl = document.createElement('canvas').getContext('webgl2');
  document.querySelector('#compatibility').textContent = `本机探测：WebGL2 ${!!gl} / Worker 画布 ${offscreen}。动画目标 30 fps。`;
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  computeButton.onclick = () => {
    if(stopped||computing)return;
    const raw = document.querySelector('#numbers').value.trim();
    const values = raw ? raw.split(/[\s,，]+/).filter(value=>value.length>0).map(Number) : [];
    if (!values.length || values.length > 10000 || values.some(value => !Number.isFinite(value))) {
      result.textContent = '请输入 1–10000 个有限数字'; return;
    }
    if (!worker&&!start())return;
    computing=true;computeButton.disabled=true;result.textContent = '计算中…';
    const current=worker;
    computeTimer=setTimeout(()=>{if(worker===current)cancel('计算响应超时，请重新计算或重载组件');},5000);
    try {current.postMessage({kind: 'compute', values, id: ++sequence});}catch {cancel('计算不可用，请重新计算或重载组件');}
  };
  document.querySelector('#cancel').onclick = () => {if(!stopped)cancel();};
  const soundButton=document.querySelector('#sound');
  function releaseSound(stop=false) {
    const tone=soundTone,gain=soundGain;soundTone=null;soundGain=null;
    if(tone){tone.onended=null;if(stop)try{tone.stop();}catch(_){}tone.disconnect();}
    gain?.disconnect();
  }
  function closeAudio() {
    const previous=audio;audio=null;
    if(previous)try{previous.close().catch(()=>{});}catch(_){}
  }
  soundButton.onclick = async () => {
    if(stopped||soundBusy||soundTone)return;
    soundBusy=true;soundButton.disabled=true;
    try {
      audio ??= new AudioContext();
      await Promise.race([audio.resume(),new Promise((_,reject)=>{
        cancelSound=()=>reject(new Error('PLAYBACK_CANCELLED'));
        soundTimer=setTimeout(()=>reject(new Error('PLAYBACK_NOT_READY')),2000);
      })]);
      if(stopped)return;
      soundGain=audio.createGain();soundGain.gain.value=.08;
      soundTone=audio.createOscillator();soundTone.connect(soundGain);soundGain.connect(audio.destination);
      soundTone.onended=()=>{releaseSound();if(!stopped)soundButton.disabled=false;};
      soundTone.start();soundTone.stop(audio.currentTime+.12);
    } catch {releaseSound(true);closeAudio();if(!stopped)result.textContent='音频不可用';}
    finally{clearTimeout(soundTimer);soundTimer=null;cancelSound=null;soundBusy=false;if(!stopped)soundButton.disabled=!!soundTone;}
  };
  window.addEventListener('pagehide', () => { stopped=true;reportController?.abort();cancelSound?.();clearTimeout(soundTimer);releaseSound(true);closeAudio();stopWorker();
    for(const button of [computeButton,document.querySelector('#cancel'),soundButton,reportButton]){button.disabled=true;button.onclick=null;}
    off(); offConfig(); offSystem(); offLifecycle();  document.removeEventListener('visibilitychange',updateActivity); }, {once: true});
})();
