(() => {
  const button=document.getElementById('testSound');
  let context=null,oscillator=null,gain=null,closed=false,busy=false,resumeTimer=null,cancelResume=null;
  function reflect(policy) {
    if(closed)return;
    button.textContent=policy.muted ? '宿主静音·试音' : '试音';
    button.title=policy.muted ? '宿主已静音' : '试音';
  }
  function releaseNodes(stop=false) {
    const tone=oscillator,level=gain;oscillator=null;gain=null;
    if(tone){tone.onended=null;if(stop)try{tone.stop();}catch(_){}tone.disconnect();}
    level?.disconnect();
  }
  function closeContext() {
    const previous=context;context=null;
    if(previous)try{previous.close().catch(()=>{});}catch(_){}
  }
  button.addEventListener('click',async()=>{
    if(busy || oscillator || closed)return;
    busy=true;button.disabled=true;
    try {
      context ||= new AudioContext();
      // 清除计时器并不能结束等待；离开时也必须拒绝本次竞速分支。
      await Promise.race([context.resume(),new Promise((_,reject)=>{
        cancelResume=()=>reject(new Error('PLAYBACK_CANCELLED'));
        resumeTimer=setTimeout(()=>reject(new Error('PLAYBACK_NOT_READY')),2000);
      })]);
      if(closed)return;
      gain=context.createGain();gain.gain.value=.02;
      oscillator=context.createOscillator();oscillator.type='sine';oscillator.frequency.value=330;
      oscillator.connect(gain);gain.connect(context.destination);
      oscillator.onended=()=>{releaseNodes();if(!closed)button.disabled=false;};
      oscillator.start();oscillator.stop(context.currentTime+.5);
    }catch(_){releaseNodes(true);closeContext();if(!closed)button.title='播放不可用；请直接点击重试并检查声音设备。';}
    finally{clearTimeout(resumeTimer);resumeTimer=null;cancelResume=null;busy=false;if(!closed)button.disabled=!!oscillator;}
  });
  widgetHost.ready.then(value=>reflect(value.audio)).catch(()=>{});
  const offAudio=widgetHost.on('audio.changed',reflect);
  window.addEventListener('pagehide',()=>{closed=true;cancelResume?.();clearTimeout(resumeTimer);releaseNodes(true);closeContext();offAudio();},{once:true});
})();
