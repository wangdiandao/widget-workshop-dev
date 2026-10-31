(() => {
  const expand = document.getElementById('expand'), orient = document.getElementById('orient');
  const status = document.getElementById('status');
  const sizes = {compact: [420,108], expanded: [420,340], vertical: [144,420]};
  const preferences = system => {if(!closed)document.body.classList.toggle('calm', system.reducedMotion === true || system.power.energySaver === true);};
  let mode = 'compact', desired = null, applying = false, regionDirty = false, regionPending = false, choosing = false, ready = false, closed = false, configEpoch = 0;
  const controller = new AbortController(), options = {signal:controller.signal};
  const buttons = () => {expand.disabled=orient.disabled=closed||choosing||!ready;};
  buttons();
  const report = error => {if(closed)return;status.textContent = '暂时无法更新花园，请重试'; console.warn('Garden update failed', error.code);};
  function setRegions() {
    if(closed)return;
    regionDirty = true;
    const environment = widgetHost.context?.environment;
    if (regionPending || applying || !environment || environment.editing) return;
    const bounds = environment.bounds, [width,height] = sizes[mode];
    if(bounds.width!==width || bounds.height!==height)return;
    regionDirty = false; regionPending = true;
    widgetHost.call('window.setInputRegions', {regions: [{x:4,y:4,width:Math.max(1,bounds.width-8),height:Math.max(1,bounds.height-8)}]},options)
      .catch(report)
      .finally(() => {regionPending = false; if (regionDirty && !widgetHost.context?.environment.editing) setRegions();});
  }
  async function render(next) {
    if(closed)return;
    desired = next;
    if (applying) return;
    applying = true;
    try {
      while (desired && !closed) {
        const target = desired; desired = null;
        try {
          const [width,height] = sizes[target];
          await widgetHost.call('window.setSize', {width,height},options);
          if(closed)return;
          mode = target; document.body.dataset.mode = mode;
          status.textContent = '';
          expand.textContent = mode === 'expanded' ? '折叠' : '展开';
          orient.textContent = mode === 'vertical' ? '横向' : '纵向';
          setRegions();
        } catch(error) {
          // 失败项不重试；等待期间若已有更新，继续处理唯一的最新目标。
          report(error);
        }
      }
    } finally {applying = false;if(!closed&&regionDirty)setRegions();}
  }
  const choose = async value => {
    if(closed||choosing||!ready)return;
    const epoch=configEpoch;choosing=true;buttons();
    try{const config=await widgetHost.call('config.set',{values:{mode:value}},options);if(!closed&&epoch===configEpoch)await render(config.mode);}
    catch(error){report(error);}finally{choosing=false;if(!closed)buttons();}
  };
  const expandClick=() => choose(mode === 'expanded' ? 'compact' : 'expanded');
  const orientClick=() => choose(mode === 'vertical' ? 'compact' : 'vertical');
  expand.addEventListener('click', expandClick);
  orient.addEventListener('click', orientClick);
  const offConfig=widgetHost.on('config.changed', config => {if(closed)return;++configEpoch;render(config.mode);});
  const offEnvironment=widgetHost.on('environment.changed', environment => {
    if(closed)return;
    if (!environment.editing) setRegions();
  });
  widgetHost.ready.then(context => {
    if(closed)return;
    ready=true;buttons();
    preferences(context.system);
    return render(context.configuration.mode);
  }).catch(report);
  const offSystem=widgetHost.on('system.changed', preferences);
  window.addEventListener('pagehide',()=>{
    closed=true;desired=null;regionDirty=false;controller.abort();buttons();
    expand.removeEventListener('click',expandClick);orient.removeEventListener('click',orientClick);
    offConfig();offEnvironment();offSystem();
  },{once:true});
})();
