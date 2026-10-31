(() => {
  const element = id => document.getElementById(id), simulation = window.gardenSimulation;
  const key = {slot:'hero'};
  const actions = ['pauseGame','sellSeed','trainSkill','saveGame','restoreGame','exportGame'];
  let state = null, revision = null, previous = null, busy = false, failed = false, closed = false, savedAt = null, closing = false, onIdle = null;
  let shared = false;
  const lifecycleStops = new Set();
  const blocked = () => lifecycleStops.size > 0 || widgetHost.context?.system?.sessionLocked === true;
  let displayTimer = null, saveTimer = null;
  const controller = new AbortController(), options = {signal:controller.signal};
  const check = () => {if(closed || controller.signal.aborted)throw Object.assign(new Error('Page closed'),{code:'CANCELLED'});};
  const call = (method, params) => {check();return widgetHost.call(method,params,options);};
  const compact = value => {
    for(const [unit,label] of [[1e12,'万亿'],[1e8,'亿'],[1e4,'万']])
      if(value>=unit)return `${Math.floor(value/unit*10)/10}${label}`;
    return String(value);
  };
  function render() {
    if(closed)return;
    document.body.classList.toggle('sceneInactive',!canRead());
    actions.forEach(id => {element(id).disabled = closing || busy || failed || !state;});
    element('retryGame').disabled=closing||busy;element('retryGame').hidden=!failed;
    document.body.classList.toggle('gameReady',!!state);
    const stats=element('heroStats');
    if (!state) {
      stats.textContent=failed&&!busy?'读取失败 · 展开重试':'读取进度…';
      element('inventoryCounts').textContent='暂无存档快照';
      element('experienceLabel').textContent='暂无经验进度';
      element('patrolProgress').value=element('experienceProgress').value=0;
      element('experienceProgress').setAttribute('aria-label','暂无经验进度');
      element('pauseGame').textContent='暂停巡逻';
      element('trainSkill').textContent='等待进度';
      document.body.classList.toggle('gamePaused',false);
      stats.title=stats.textContent;stats.setAttribute('aria-label',stats.title);return;
    }
    const visible = failed ? state : simulation.settle(state,Date.now()).value;
    const experiencePerLevel=30,level=1+Math.floor(visible.xp/experiencePerLevel);
    stats.textContent = (failed?(busy?'正在读取 · ':'进度未更新 · '):'')+`Lv.${compact(level)} · ${compact(visible.gold)} 金 · ${compact(visible.seeds)} 种`;
    stats.title=(failed?(busy?'正在重新读取；最后成功快照：':'进度未更新，展开重新读取；最后成功快照：'):'')+`Lv.${level} · ${visible.gold} 金 · ${visible.seeds} 种`;
    stats.setAttribute('aria-label',stats.title);
    element('patrolProgress').value=visible.partialMs;
    element('inventoryCounts').textContent=`金币 ${visible.gold} · 种子 ${visible.seeds}`;
    const experienceCapped=visible.xp>=1e12,levelExperience=visible.xp%experiencePerLevel;
    element('experienceLabel').textContent=experienceCapped?`累计经验 ${visible.xp} · 已达上限`:
      `累计经验 ${visible.xp} · 距下一级还需 ${experiencePerLevel-levelExperience}`;
    element('experienceProgress').max=experiencePerLevel;
    element('experienceProgress').value=experienceCapped?experiencePerLevel:levelExperience;
    element('experienceProgress').setAttribute('aria-label',experienceCapped?'经验已达上限':`本级经验 ${levelExperience} / ${experiencePerLevel}`);
    element('pauseGame').textContent = state.paused ? '继续巡逻' : '暂停巡逻';
    element('sellSeed').disabled ||= visible.seeds < 1;
    element('trainSkill').textContent = `阳光 ${state.skill}/20 · ${10*(state.skill+1)} 金`;
    element('trainSkill').disabled ||= state.skill >= 20 || visible.gold < 10*(state.skill+1);
    element('restoreGame').disabled ||= !previous;
    document.body.classList.toggle('gamePaused',state.paused);
  }
  function endOperation() {busy = false; const notify = onIdle; onIdle = null; notify?.();
  }
  function fail(error) {
    if (closed) return;
    failed = true;
    element('saveStatus').textContent = `进度已停止：${error.code || error.message}。重新读取后继续。`;
    render();
  }
  async function publish(next) {
    const saved = await call('saves.commit',{...key,expectedRevision:revision,value:next});
    check();
    previous = revision; revision = saved.revision; savedAt = saved.savedAt; state = next;
    element('saveStatus').textContent = `已保存 ${new Date(savedAt).toLocaleTimeString()}`;
    if(shared && !closing) await call('collaboration.publish',{value:{revision}}).catch(()=>{});
  }
  async function checkpoint(change = value => value) {
    if (busy || failed || !state || closed || closing) return;
    busy = true; render();
    try { await publish(change(simulation.settle(state,Date.now()).value)); }
    catch(error) {fail(error);} finally {endOperation(); if (!closed) render();}
  }
  const canRead = () => !closed && !closing && !blocked() && widgetHost.context?.visible !== false && !document.hidden;
  function displayActivity() {
    clearInterval(displayTimer); displayTimer=null;
    if(canRead()) displayTimer=setInterval(render,1000);
    render();
  }
  async function reload() {
    if (busy || closed || closing) return;
    element('recoverySummary').textContent='';element('recoverySummary').hidden=true;
    busy = true; failed = true; render();
    try {
      const scope = await call('saves.context',{});
      check();
      shared = scope.scope === 'installation';
      const saved = await call('saves.load',key); check();
      revision = saved.current?.revision ?? null; previous = saved.previous?.revision ?? null;
      const old = saved.found ? saved.current.value : simulation.fresh(Date.now());
      const advanced = simulation.settle(old,Date.now());
      await publish(advanced.value); check(); failed = false;
      if(saved.found){
        const summary=element('recoverySummary');
        summary.textContent=old.paused?'本次恢复：游戏已暂停，未补算收益。':
          `本次恢复收益已保存 · 有效 ${Math.floor(advanced.elapsedMs/1000)} 秒 · 金币 +${advanced.value.gold-old.gold} · 经验 +${advanced.value.xp-old.xp} · 种子 +${advanced.value.seeds-old.seeds}`;
        if(advanced.capped)summary.textContent+=' · 最多补算八小时';
        if(advanced.clockMovedBack)summary.textContent+=' · 时钟回拨，未补算';
        summary.hidden=false;
      }
      if (saved.recovered) element('saveStatus').textContent += ' · 已从成功备份恢复';
      else if (advanced.capped) element('saveStatus').textContent += ' · 离线收益上限八小时';
      else if (advanced.clockMovedBack) element('saveStatus').textContent += ' · 时钟回拨，本次不补算';
    } catch(error) {fail(error);} finally {endOperation(); if (!closed) render();}
  }
  element('saveGame').onclick = () => checkpoint();
  element('pauseGame').onclick = () => checkpoint(value => ({...value,paused:!value.paused}));
  element('sellSeed').onclick = () => checkpoint(value => value.seeds > 0 ? {...value,seeds:value.seeds-1,gold:Math.min(1e12,value.gold+5)} : value);
  element('trainSkill').onclick = () => checkpoint(value => value.skill < 20 && value.gold >= 10*(value.skill+1) ?
    {...value,gold:value.gold-10*(value.skill+1),skill:value.skill+1} : value);
  element('retryGame').onclick = reload;
  for (const tab of ['inventory','skill']) element(tab+'Tab').onclick = () => {
    if(closed)return;
    for (const item of ['inventory','skill']) {
      element(item+'Panel').hidden = tab !== item; element(item+'Tab').setAttribute('aria-pressed',String(tab === item));
    }
  };
  element('restoreGame').onclick = async () => {
    if (closed || busy || failed || !previous || closing) return;
    busy = true; render();
    try { await call('saves.restore',{...key,expectedRevision:revision}); check(); }
    catch(error) {fail(error);} finally {endOperation();}
    if (!closed) {if (!failed) await reload(); else render();}
  };
  element('exportGame').onclick = async () => {
    if (closed || busy || failed || !state || closing) return;
    busy = true; render(); let exportId;
    try {
      const bytes = new TextEncoder().encode(JSON.stringify({...key,revision,savedAt,value:state},null,2));
      ({exportId} = await call('exports.begin',{name:'garden-save.json',sizeBytes:bytes.length}));
      check();
      for (let offset=0; offset<bytes.length; offset+=65536) {
        const chunk = bytes.subarray(offset,offset+65536);
        await call('exports.write',{exportId,offset,bodyBase64:btoa(String.fromCharCode(...chunk))});
        check();
      }
      await call('exports.save',{exportId}); check(); element('saveStatus').textContent = '备份已导出';
    } catch(error) {
      if (!closed) element('saveStatus').textContent = error.code === 'CANCELLED' ? '保存未完成确认，请检查所选位置。' : `导出失败：${error.code || 'UNKNOWN'}`;
    } finally {
      if (exportId) await widgetHost.call('exports.close',{exportId}).catch(()=>{});
      endOperation(); if (!closed) render();
    }
  };
  const offClosing=widgetHost.onClosing(async () => {
    if(closed)throw new Error('Save unavailable');
    closing = true; clearInterval(displayTimer); clearInterval(saveTimer); render();
    if (busy) await new Promise(resolve => {onIdle = resolve;});
    if(closed)throw new Error('Save unavailable');
    if (failed || !state) throw new Error('Save unavailable');
    busy = true;
    try {await publish(simulation.settle(state,Date.now()).value);}
    finally {endOperation();}
  });
  const offLifecycle = widgetHost.on('lifecycle.changed',event => {
    if(closed)return;
    if (event.state === 'locked') lifecycleStops.add('locked');
    if (event.state === 'suspending') lifecycleStops.add('suspending');
    if (event.state === 'unlocked') lifecycleStops.delete('locked');
    if (event.state === 'resumed') lifecycleStops.delete('suspending');
    if (event.state === 'resumed' || event.state === 'unlocked') {if(!blocked()) checkpoint();}
    displayActivity();
  });
  const visibleChanged = () => {
    if(closed)return;
    displayActivity();
  };
  const offVisible = widgetHost.on('visibility.changed',visibleChanged);
  const offSystem = widgetHost.on('system.changed',visibleChanged);
  document.addEventListener('visibilitychange',visibleChanged);
  window.addEventListener('pagehide',()=>{
    closed=true;
    for(const id of [...actions,'retryGame','inventoryTab','skillTab']){element(id).disabled=true;element(id).onclick=null;}
    clearInterval(displayTimer);clearInterval(saveTimer);controller.abort();
    offClosing();offLifecycle();offVisible();offSystem();document.removeEventListener('visibilitychange',visibleChanged);
  },{once:true});
  widgetHost.ready.then(()=>{if(closed)return;saveTimer=setInterval(()=>checkpoint(),15000);displayActivity();return reload();}).catch(fail);
})();
