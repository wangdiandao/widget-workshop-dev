(() => {
  const scene=document.querySelector('#scene'), fallback=document.querySelector('#fallback');
  let worker, stopped=false, failed=false, suspended=false, locked=false, latest, inFlight=0, sequence=0, watchdog, preview, fallbackState;
  const page=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
  function emit(value) {
    document.documentElement.dataset.renderer=value.mode;
    dispatchEvent(new CustomEvent('stardust.status',{detail:{page,preview:preview?.status||'unused',...value}}));
  }
  function closeWorker() {
    if(!worker)return;
    worker.onmessage=null;worker.onerror=null;worker.terminate();worker=null;
  }
  function degrade() {
    if(failed||stopped)return;failed=true;clearTimeout(watchdog);closeWorker();inFlight=0;latest=null;
    scene.hidden=true;fallback.hidden=false;
    if(widgetHost.context)update();else emit({mode:'fallback',frames:0,timerActive:false});
  }
  function send() {
    if(stopped||failed||inFlight||!latest)return;
    inFlight=++sequence;const state=latest;latest=null;
    try {worker.postMessage({kind:'state',sequence:inFlight,state});}
    catch {degrade();return;}
    clearTimeout(watchdog);watchdog=setTimeout(degrade,2000);
  }
  function update() {
    const host=widgetHost.context;if(!host||stopped)return;
    const state=starPolicy(host.configuration,host.system,{visible:host.visible&&!document.hidden,editing:host.environment.editing},
      {width:innerWidth,height:innerHeight,ratio:devicePixelRatio},suspended || locked);
    document.documentElement.dataset.palette=state.palette;
    if(failed){
      fallbackState={mode:'fallback',frames:0,timerActive:false,palette:state.palette,policyMode:state.mode};
      preview??=createStarPreview(fallback,()=>{if(!stopped&&fallbackState)emit(fallbackState);});
      if(['hidden','suspended','editing'].includes(state.mode))preview.pause();else preview.update(state.palette);
      emit(fallbackState);return;
    }
    latest=state;send();
  }
  try {
    if(typeof scene.transferControlToOffscreen!=='function')throw new Error('OffscreenCanvas unavailable');
    worker=new Worker('render-worker.js');
    worker.onerror=event=>{event.preventDefault();degrade();};
    worker.onmessage=({data})=>{
      if(stopped||failed)return;
      if(data.kind==='failed'){degrade();return;}
      if(data.kind==='applied'&&data.sequence===inFlight) {
        clearTimeout(watchdog);inFlight=0;fallback.hidden=true;emit(data);send();
      } else if(data.kind==='status') {
        emit(data);
        if(!stopped&&!failed) {
          try {worker.postMessage({kind:'statusAck',statusId:data.statusId});}
          catch {degrade();}
        }
      }
    };
    const canvas=scene.transferControlToOffscreen();worker.postMessage({kind:'canvas',canvas},[canvas]);
  } catch { degrade(); }
  const offConfig=widgetHost.on('config.changed',update),offSystem=widgetHost.on('system.changed',update);
  const offVisible=widgetHost.on('visibility.changed',update),offEnvironment=widgetHost.on('environment.changed',update);
  const offLifecycle=widgetHost.on('lifecycle.changed',({state})=>{
    if(state==='locked')locked=true;
    if(state==='unlocked')locked=false;
    if(state==='suspending')suspended=true;
    if(state==='resumed')suspended=false;
    update();
  });
  addEventListener('resize',update);document.addEventListener('visibilitychange',update);
  widgetHost.ready.then(update).catch(degrade);
  addEventListener('pagehide',()=>{
    stopped=true;preview?.close();clearTimeout(watchdog);closeWorker();
    offConfig();offSystem();offVisible();offEnvironment();offLifecycle();
    removeEventListener('resize',update);document.removeEventListener('visibilitychange',update);
    latest=null;inFlight=0;
  },{once:true});
})();
