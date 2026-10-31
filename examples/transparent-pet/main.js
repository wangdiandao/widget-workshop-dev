(() => {
  const pet = document.querySelector('#pet'), panel = document.querySelector('#panel');
  const status = document.querySelector('#status');
  const controller = new AbortController(), options = {signal:controller.signal};
  let interactive = true, stopped = false, updating = false, dirty = false;
  let wander = false, moving = false, dragging = false, direction = 1;
  const lifecycleStops=new Set();
  function renderPaused() {
    const context=widgetHost.context;
    return !context||!context.visible||document.hidden||context.environment.editing||context.system.sessionLocked===true||lifecycleStops.size>0;
  }
  const walkTimer = setInterval(async () => {
    const context = widgetHost.context;
    // 用户正在操作面板或等待拖动响应时，不让下一步散步挪走目标。
    const panelActive = interactive && !panel.hidden && panel.contains(document.activeElement);
    if (!context || renderPaused() || !wander || moving || dragging || panelActive || stopped ||
        context.system.reducedMotion || context.system.power.energySaver) return;
    const {bounds, workArea} = context.environment;
    if (bounds.x + 12 > workArea.width - bounds.width) direction = -1;
    if (bounds.x < 12) direction = 1;
    moving = true;
    try { await widgetHost.call('window.moveTo', {x:bounds.x + 12 * direction, y:bounds.y}, options); }
    catch (_) { /* 编辑或系统过渡时跳过本次移动，不累积重试。 */ }
    finally { moving = false; }
  }, 1000);
  async function regions() {
    if (stopped) return;
    dirty = true;
    if (updating) return;
    updating = true;
    try {
      while (dirty && !stopped) {
        dirty = false;
        if (!widgetHost.context || widgetHost.context.environment.editing) break;
        await widgetHost.call('window.setInputRegions', {regions: interactive ? [
          {points:[{x:116,y:10},{x:164,y:10},{x:184,y:34},{x:184,y:88},
            {x:164,y:110},{x:116,y:110},{x:96,y:88},{x:96,y:34}]},
          {x:12,y:126,width:256,height:82}
        ] : []}, options);
      }
    } catch (error) { if (!stopped) status.textContent = `交互暂不可用：${error.code}`; }
    finally {
      updating = false;
      if (dirty && !stopped && !widgetHost.context?.environment.editing) regions();
    }
  }
  function configure(values) {
    if(stopped)return;
    interactive = values.interactive; wander = values.wander;
    document.body.classList.toggle('palettePeach',values.palette==='peach');
    document.body.classList.toggle('paletteSky',values.palette==='sky');
    panel.hidden = !interactive; regions();
  }
  const activity = () => {
    if(stopped)return;
    const context=widgetHost.context;
    document.body.classList.toggle('activityReady',!!context);
    document.body.classList.toggle('renderPaused',!!renderPaused());
    document.body.classList.toggle('calm',context?.system.reducedMotion===true||context?.system.power.energySaver===true);
  };
  const offConfig = widgetHost.on('config.changed', configure);
  const offEnvironment = widgetHost.on('environment.changed', () => {regions();activity();});
  const offSystem=widgetHost.on('system.changed',activity);
  const offLifecycle=widgetHost.on('lifecycle.changed',({state})=>{
    if(state==='locked'||state==='suspending')lifecycleStops.add(state);
    if(state==='unlocked')lifecycleStops.delete('locked');
    if(state==='resumed')lifecycleStops.delete('suspending');
    activity();
  });
  const offVisible=widgetHost.on('visibility.changed',activity);
  document.addEventListener('visibilitychange',activity);
  widgetHost.ready.then(context => {if(stopped)return;activity();configure(context.configuration);}).catch(() => { if(!stopped)status.textContent = '宿主不可用'; });
  const drag = event => {
    if (stopped || event.button !== 0 || !interactive) return;
    event.preventDefault();
    if (dragging) return;
    dragging = true;
    widgetHost.call('window.beginDrag', {}, options)
      .catch(error => { if (!stopped) status.textContent = `拖动暂不可用：${error.code}`; })
      .finally(() => { dragging = false; });
  };
  pet.addEventListener('pointerdown', drag);
  window.addEventListener('pagehide', () => { stopped = true; dirty = false; controller.abort();clearInterval(walkTimer);pet.removeEventListener('pointerdown',drag);offConfig(); offEnvironment(); offSystem();offLifecycle();offVisible();document.removeEventListener('visibilitychange',activity); }, {once:true});
})();
