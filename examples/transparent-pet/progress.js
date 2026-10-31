/* 现有投喂和名字属于进度；只使用成功修订，不能随布局恢复回退。 */
(() => {
  const name=document.getElementById('petName'),feed=document.getElementById('feed'),status=document.getElementById('status');
  const key={slot:'pet'},controller=new AbortController(),options={signal:controller.signal};
  let value=null,revision=null,busy=false,failed=false,closed=false,closing=false,composing=false,renameWanted=false,onIdle=null;
  const valid=state=>state&&Number.isSafeInteger(state.clicks)&&state.clicks>=0&&state.clicks<=1e12&&typeof state.name==='string'&&state.name.length<=40&&!/[\u0000-\u001f\u007f]/.test(state.name);
  const call=(method,params)=>widgetHost.call(method,params,options);
  function render(){
    if(closed)return;
    name.disabled=closed||closing||busy||failed||!value;
    feed.disabled=closed||closing||busy||composing||(!failed&&value?.clicks>=1e12);
    feed.textContent=failed?'重新读取':'投喂';
    if(failed)return;
    status.textContent=!value?'正在读取进度…':`点击 ${value.clicks} 次 · ${value.name} · ${revision?'已保存':'尚未保存'}${composing?' · 输入法组词中，尚未保存':name.value!==value.name?' · 名字未保存':''}`;
  }
  function fail(error){if(closed)return;failed=true;if(value)name.value=value.name;status.textContent=`进度未更新：${error.code||error.message||'UNKNOWN'}；请重新读取`;}
  function finish(){busy=false;const notify=onIdle;onIdle=null;notify?.();if(!closed)render();}
  async function load(){
    if(busy||closed||closing)return;busy=true;render();
    try{
      const saved=await call('saves.load',key);if(closed)return;
      const next=saved.found?saved.current?.value:{clicks:0,name:'团团'};
      if(!valid(next))throw Error('SAVE_DATA_INVALID');
      value=next?{clicks:next.clicks,name:next.name}:null;revision=saved.current?.revision??null;
      name.value=value?.name??'';failed=false;
    }catch(error){fail(error);}finally{finish();}
  }
  async function publish(next){
    if(!valid(next))throw Error('SAVE_DATA_INVALID');
    const saved=await call('saves.commit',{...key,expectedRevision:revision,value:next});
    if(closed)return;value=next;revision=saved.revision;name.value=next.name;
  }
  async function change(next){
    if(busy||closed||closing||failed||!value)return;busy=true;render();
    try{await publish(next);}catch(error){fail(error);}finally{finish();}
  }
  const rename=()=>{if(closed||closing)return;if(composing){renameWanted=true;return;}if(value&&name.value!==value.name)change({...value,name:name.value});};
  const clicked=()=>{if(composing)return;if(failed)load();else if(value&&value.clicks<1e12)change({...value,clicks:value.clicks+1});};
  const compositionStart=()=>{if(closed||closing||name.disabled)return;if(!composing)renameWanted=false;composing=true;render();};
  const compositionEnd=()=>{if(closed||closing)return;const wanted=renameWanted;composing=false;renameWanted=false;render();if(wanted)rename();};
  feed.addEventListener('click',clicked);name.addEventListener('change',rename);name.addEventListener('input',render);
  name.addEventListener('compositionstart',compositionStart);name.addEventListener('compositionend',compositionEnd);
  const offClosing=widgetHost.onClosing(async()=>{
    if(closed)throw Error('Save unavailable');
    // 禁用输入可能结束组合；保存决定必须使用关闭开始时的状态。
    const unfinishedComposition=composing;
    closing=true;render();if(busy)await new Promise(resolve=>{onIdle=resolve;});
    if(closed||failed)throw Error('Save unavailable');
    if(!value)throw Error('Save unavailable');
    if(unfinishedComposition)throw Error('Composition pending');
    if(name.value!==value.name)await publish({...value,name:name.value});
  });
  window.addEventListener('pagehide',()=>{closed=true;name.disabled=feed.disabled=true;controller.abort();offClosing();feed.removeEventListener('click',clicked);name.removeEventListener('change',rename);name.removeEventListener('input',render);name.removeEventListener('compositionstart',compositionStart);name.removeEventListener('compositionend',compositionEnd);},{once:true});
  name.disabled=feed.disabled=true;
  widgetHost.ready.then(load).catch(error=>{fail(error);if(!closed)render();});
})();
