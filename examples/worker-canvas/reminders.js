/* 提醒的操作槽独立于 Worker；取消不撤回已经提交的持久提醒。 */
(() => {
  const element=id=>document.querySelector('#'+id),status=element('reminders');
  const buttons=['timer','removeTimer','refreshTimers','clearTimers'].map(element);
  const inputs=['seconds','reminderUnit','reminderSlot','reminderTitle'].map(element);
  const cancel=element('cancelReminderOperation');
  let active=null,activeMethod=null,confirmedFeedback='',closed=false,allowed=widgetHost.context?.capabilities?.notifications;
  const controls=()=>{for(const control of [...buttons,...inputs])control.disabled=closed||!!active;cancel.disabled=closed||!active||active.signal.aborted;};
  const check=operation=>{if(closed||operation.signal.aborted)throw Object.assign(Error('Cancelled'),{code:'CANCELLED'});};
  async function act(method='reminders.list') {
    if(closed||active)return;
    const seconds=Number(element('seconds').value);
    const multiplier={seconds:1,minutes:60,hours:3600,days:86400}[element('reminderUnit').value];
    const duration=seconds*multiplier,title=element('reminderTitle').value.trim(),slot=Number(element('reminderSlot').value);
    if(['reminders.set','reminders.remove'].includes(method)&&(!Number.isInteger(slot)||slot<1||slot>8)){
      status.textContent='请选择提醒位置 1–8';return;
    }
    const key=slot===1?'timer':'timer-'+slot;
    if(method==='reminders.set'&&(!Number.isSafeInteger(seconds)||seconds<1||!Number.isSafeInteger(duration)||duration>2592000)){
      status.textContent='时长应为正整数，合计不超过 30 天';return;
    }
    if(method==='reminders.set'&&(!title||title.length>48||/[\u0000-\u001f\u007f]/.test(title))){
      status.textContent='提醒名称应为 1–48 个字符单元，不能含控制字符';return;
    }
    const operation=active=new AbortController(),options={signal:operation.signal};activeMethod=method;confirmedFeedback='';
    let feedback='';controls();
    try {
      await widgetHost.ready;check(operation);
      if(method!=='reminders.list') {
        const dueAt=Date.now()+duration*1000;
        const params=method==='reminders.set'?{key,dueAt,expiresAt:dueAt+3600000,title,body:'已到设定时间'}:
          method==='reminders.remove'?{key}:{};
        await widgetHost.call(method,params,options);check(operation);
        feedback=method==='reminders.set'?'提醒已保存；重载保留，彻底退出停投，到期后一小时内重启可恢复。停用或撤权清空。':
          method==='reminders.remove'?'已取消提醒。':'已清空提醒。';
        confirmedFeedback=feedback;
      }
      const {items}=await widgetHost.call('reminders.list',{},options);check(operation);
      status.textContent=feedback+(items.length?'\n'+items.map(item=>{
        const match=/^timer(?:-([2-8]))?$/.exec(item.key);
        return `${match?'位置 '+(match[1]||'1'):item.key} · ${item.title} · ${new Date(item.dueAt).toLocaleString()}`;
      }).join('\n'):'没有待投递提醒');
    } catch(error) {
      if(!closed&&!operation.signal.aborted)status.textContent=feedback?`${feedback}列表不可读取：${error.code||'RESOURCE_UNAVAILABLE'}`:
        `提醒操作失败：${error.code||'RESOURCE_UNAVAILABLE'}${error.code==='CANCELLED'&&method!=='reminders.list'?'；修改未完成确认，请手动刷新核对。':''}`;
    } finally {active=null;activeMethod=null;confirmedFeedback='';controls();}
  }
  element('timer').onclick=()=>act('reminders.set');
  element('removeTimer').onclick=()=>act('reminders.remove');
  element('refreshTimers').onclick=()=>act();
  element('clearTimers').onclick=()=>act('reminders.clear');
  cancel.onclick=()=>{
    if(closed||!active||active.signal.aborted)return;
    active.abort();
    status.textContent=confirmedFeedback?`${confirmedFeedback}已取消列表刷新；修改已提交。`:activeMethod==='reminders.list'?'已取消刷新。':'修改未完成确认，请手动刷新核对。';
    cancel.disabled=true;
  };
  const offCaps=widgetHost.on('capabilities.changed',values=>{
    if(closed||values.notifications===allowed)return;
    allowed=values.notifications;active?.abort();
    controls();
    status.textContent='通知权限已变化，请手动刷新；仍可取消或清空本实例提醒。';
  });
  const offConfig=widgetHost.on('config.changed',()=>{
    if(closed)return;active?.abort();controls();status.textContent='配置已变化，请手动刷新提醒。';
  });
  widgetHost.ready.then(context=>{if(closed)return;allowed=context.capabilities.notifications;return act();})
    .catch(()=>{if(!closed&&!active)status.textContent='宿主不可用，请重载组件。';});
  window.addEventListener('pagehide',()=>{
    closed=true;active?.abort();offCaps();offConfig();for(const button of [...buttons,cancel])button.onclick=null;controls();
  },{once:true});
})();
