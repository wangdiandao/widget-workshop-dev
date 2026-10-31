(() => {
  const node=id=>document.getElementById(id),button=node('readClipboard'),cancel=node('cancelClipboardRead'),text=node('clipboardText'),status=node('clipboardStatus');
  let active=null,closed=false;
  const clear=()=>{text.textContent='';text.hidden=true;};
  const controls=()=>{button.disabled=closed||!!active;cancel.disabled=closed||!active||active.signal.aborted;};
  async function read(){
    if(active||closed)return;
    const operation=active=new AbortController();clear();controls();status.textContent='正在读取…';
    try{
      await widgetHost.ready;if(closed||operation.signal.aborted)return;
      const value=await widgetHost.call('clipboard.readText',{}, {signal:operation.signal});
      if(closed||operation.signal.aborted)return;
      if(value.text!==null&&(typeof value.text!=='string'||value.text.length>32768))throw {code:'INVALID_RESULT'};
      text.textContent=value.text??'';text.hidden=value.text===null;
      status.textContent=value.text===null?'剪贴板没有可用纯文本':`已读取 ${value.text.length} 个字符单元；未保存`;
    }catch(error){if(!closed&&!operation.signal.aborted)status.textContent=error.code==='CAPABILITY_DENIED'?'请在组件详情授予剪贴板读写权限。':`读取失败：${error.code||'UNKNOWN'}`;}
    finally{active=null;controls();}
  }
  const stop=()=>{if(closed||!active)return;active.abort();clear();controls();status.textContent='已取消读取';};
  const invalidate=()=>{if(closed)return;active?.abort();clear();controls();status.textContent='配置或权限已变化，请手动读取。';};
  button.addEventListener('click',read);cancel.addEventListener('click',stop);
  const offCaps=widgetHost.on('capabilities.changed',invalidate),offConfig=widgetHost.on('config.changed',invalidate);
  window.addEventListener('pagehide',()=>{closed=true;active?.abort();clear();controls();offCaps();offConfig();button.removeEventListener('click',read);cancel.removeEventListener('click',stop);},{once:true});
  controls();
})();
