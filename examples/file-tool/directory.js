(() => {
  const host=widgetHost, status=document.getElementById('directoryStatus'), entries=document.getElementById('entries');
  const start=document.getElementById('watch'), stop=document.getElementById('stopWatch'), refresh=document.getElementById('refresh');
  let active=null, closed=false, generation=0, hasSnapshot=false;
  const snapshotHint=()=>hasSnapshot?'；显示上次成功列表（非最新）':'';
  const sleep=(ms,signal)=>new Promise((resolve,reject)=>{
    check(signal);
    const abort=()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);reject(Object.assign(new Error(),{code:'CANCELLED'}));};
    const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);
    signal.addEventListener('abort',abort,{once:true});
  });
  const current=version=>!closed&&version===generation;
  const check=signal=>{if(closed||signal.aborted)throw Object.assign(new Error(),{code:'CANCELLED'});};
  function clearAndAbort(){
    ++generation;active?.abort();entries.replaceChildren();hasSnapshot=false;
  }
  function invalidate(text){
    if(closed)return;clearAndAbort();status.textContent=text;
  }
  function finish(controller){
    if(active!==controller)return;active=null;
    if(!closed){start.disabled=refresh.disabled=false;stop.disabled=true;}
  }
  function message(error){
    return (error.code==='CANCELLED'?'监听已停止':`操作结束：${error.code||'INTERNAL_ERROR'}，可手动重新开始`)+snapshotHint();
  }
  async function listing(binding,signal){
    check(signal);
    const page=await host.call('directory.list',{bindingId:binding,relativePath:''},{signal});
    try {
      check(signal);
      entries.replaceChildren(...page.entries.map(entry=>{const row=document.createElement('li');row.textContent=`${entry.kind==='directory'?'目录':'文件'} · ${entry.name}`;return row;}));
      hasSnapshot=true;
      status.textContent=`已刷新 ${page.entries.length} 项${page.nextCursor?'（仅显示前 100 项）':''}`;
    }finally{if(page.nextCursor)await host.call('directory.cancel',{cursor:page.nextCursor}).catch(()=>{});}
  }
  const onStart=async()=>{
    if(active||closed)return;
    const controller=active=new AbortController(),version=generation;start.disabled=true;stop.disabled=false;refresh.disabled=true;
    status.textContent='正在启动监听'+snapshotHint();
    let watch;
    try{
      await host.ready;
      check(controller.signal);
      const binding=host.context.configuration.folder;
      if(!binding){status.textContent='请先在宿主配置中选择目录';return;}
      watch=await host.call('directory.watch.open',{bindingId:binding},{signal:controller.signal});
      await listing(binding,controller.signal);let revision=watch.revision;
      while(!controller.signal.aborted){
        await sleep(1000,controller.signal);if(controller.signal.aborted)break;
        const next=await host.call('directory.watch.poll',{watchId:watch.watchId},{signal:controller.signal});
        check(controller.signal);
        if(next.revision!==revision){await listing(binding,controller.signal);revision=next.revision;}
      }
      if(current(version))status.textContent='监听已停止'+snapshotHint();
    }catch(error){if(current(version))status.textContent=message(error);}
    finally{if(watch)await host.call('directory.watch.close',{watchId:watch.watchId}).catch(()=>{});finish(controller);}
  };
  const onStop=()=>{if(!closed)active?.abort();};
  const onRefresh=async()=>{
    if(active||closed)return;const controller=active=new AbortController(),version=generation;refresh.disabled=start.disabled=true;stop.disabled=false;
    status.textContent='正在刷新'+snapshotHint();
    try{await host.ready;check(controller.signal);const binding=host.context.configuration.folder;if(!binding){status.textContent='请先在宿主配置中选择目录';return;}await listing(binding,controller.signal);}
    catch(error){if(current(version))status.textContent=message(error);}
    finally{finish(controller);}
  };
  start.addEventListener('click',onStart);stop.addEventListener('click',onStop);refresh.addEventListener('click',onRefresh);
  const offConfig=host.on('config.changed',()=>invalidate('配置已变化，请手动刷新目录'));
  window.addEventListener('pagehide',()=>{
    if(closed)return;closed=true;clearAndAbort();start.disabled=stop.disabled=refresh.disabled=true;
    offConfig();start.removeEventListener('click',onStart);stop.removeEventListener('click',onStop);refresh.removeEventListener('click',onRefresh);
  },{once:true});
})();
