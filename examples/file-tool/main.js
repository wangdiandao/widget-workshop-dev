(() => {
  const choose = document.getElementById('choose'), cancel = document.getElementById('cancel');
  const output = document.getElementById('result'), asset = document.getElementById('asset');
  const exportButton = document.getElementById('export'), copyButton = document.getElementById('copy');
  const network = document.getElementById('network');
  const preview=document.getElementById('responsePreview'),responseText=document.getElementById('responseText'),previewStatus=document.getElementById('previewStatus');
  function clearPreview(){preview.hidden=true;responseText.textContent='';previewStatus.textContent='';}
  let lastResult = null;
  let active = null, closed = false, activeKind = null;
  const clickHandlers=[];
  const listen=(button,handler)=>{button.addEventListener('click',handler);clickHandlers.push([button,handler]);};
  const check = controller => {if(closed||controller.signal.aborted)throw Object.assign(new Error('Cancelled'),{code:'CANCELLED'});};
  function finish(){active=null;activeKind=null;if(closed)return;choose.disabled=asset.disabled=network.disabled=false;cancel.disabled=true;exportButton.disabled=copyButton.disabled=!lastResult;}
  listen(cancel, () => {if(closed||!active||!activeKind)return;active.abort();output.textContent=activeKind==='network.open'?'已取消网络统计':activeKind==='export'?'保存未完成确认，请检查所选位置。':activeKind==='copy'?'复制未完成确认；已写入的剪贴板不能撤回':'已取消；原文件未修改';if(['network.open','files.open','assets.open'].includes(activeKind)&&!preview.hidden)previewStatus.textContent='已取消；仅显示已接收片段';});
  listen(choose, () => scan('files.open', {}));
  listen(asset, () => scan('assets.open', {path:'assets/sample.txt'}));
  listen(network, () => scan('network.open',null));
  async function scan(method, params) {
    if (active || closed) return;
    const controller = active = new AbortController();
    activeKind=method;
    const options = {signal: controller.signal};
    lastResult = null; exportButton.disabled = copyButton.disabled = true;
    clearPreview();
    choose.disabled = asset.disabled = network.disabled = true; cancel.disabled = false;
    let file;
    try {
      await widgetHost.ready;check(controller);
      if(method==='network.open'){
        const configuration=widgetHost.context.configuration;
        if(!configuration.url){output.textContent='请先在宿主配置中设置网络统计地址';return;}
        const headers=configuration.token?[{name:'Authorization',secretBindingId:configuration.token,prefix:'Bearer '}]:[];
        params={url:configuration.url,method:'GET',headers};
      }
      file = await widgetHost.call(method, params, options);
      check(controller);
      const streaming = method === 'network.open', name = streaming ? `HTTP ${file.status}` : file.name;
      const contentType=(file.headers||[]).find(header=>header.name.toLowerCase()==='content-type')?.value.split(';')[0].trim().toLowerCase()||'';
      const textResponse=streaming&&widgetHost.context.configuration.responsePreview===true&&(/^(text\/|application\/(json|x-ndjson)$)/.test(contentType)||contentType.endsWith('+json'));
      const textFile=!streaming&&widgetHost.context.configuration.filePreview===true&&/\.(txt|csv|md|json|jsonl|ndjson|log)$/i.test(file.name);
      const decoder=textResponse||textFile?new TextDecoder('utf-8'):null;let previewText='',truncated=false;
      function appendPreview(text){
        if(!decoder||truncated)return;
        const available=8192-previewText.length;
        if(text.length>available){let end=available;if(end>0&&/[\uD800-\uDBFF]/.test(text[end-1]))--end;text=text.slice(0,end);truncated=true;}
        previewText+=text;responseText.textContent=previewText;preview.hidden=false;
        previewStatus.textContent=truncated?'已截断，仅显示前 8192 个字符单元；统计继续':'逐块显示 UTF-8 文本；最多 8192 个字符单元';
      }
      let offset = 0, newlines = 0, hash = 2166136261, eof = false;
      while (!eof) {
        if (controller.signal.aborted) throw Object.assign(new Error('Cancelled'), {code: 'CANCELLED'});
        const block = await widgetHost.call(streaming ? 'network.read' : 'files.read', streaming ? {streamId:file.streamId,offset,length:65536} : {fileId: file.fileId, offset, length: 65536}, options);
        check(controller);
        const bytes = atob(block.bodyBase64);
        if(decoder&&!truncated)appendPreview(decoder.decode(Uint8Array.from(bytes,char=>char.charCodeAt(0)),{stream:true}));
        for (let i = 0; i < bytes.length; ++i) {
          const value = bytes.charCodeAt(i);
          if (value === 10) ++newlines;
          hash = Math.imul(hash ^ value, 16777619) >>> 0;
        }
        offset += bytes.length; eof = block.eof;
        output.textContent = `${name}\n${offset}${streaming ? '' : ' / '+file.sizeBytes} 字节 · 换行 ${newlines}\nFNV-1a ${hash.toString(16).padStart(8, '0')}${eof ? ' · 完成' : ''}`;
        // 消费后才拉取下一块；为共享桥接预算留出余量，不累计整个文件。
        if (!eof) await new Promise(resolve => setTimeout(resolve, 25));
      }
      if(decoder&&!truncated)appendPreview(decoder.decode());
      if(decoder)previewStatus.textContent=truncated?'接收完成；预览已截断，仅显示开头片段':`接收完成；UTF-8 文本预览 · ${previewText.length} 个字符单元`;
      check(controller);lastResult = {name,sizeBytes:offset,newlines,fnv1a:hash.toString(16).padStart(8,'0')};
    } catch (error) {
      if(!closed&&!controller.signal.aborted){
        output.textContent = error.code === 'CANCELLED' ? (method === 'network.open' ? '已取消网络统计' : '已取消；原文件未修改') : `读取失败：${error.code || 'UNKNOWN'}`;
        if(!preview.hidden)previewStatus.textContent=`${error.code==='CANCELLED'?'已取消':'读取失败'}；仅显示已接收片段，内容不完整`;
      }
    } finally {
      activeKind=null;if(!closed)cancel.disabled=true;
      if (file) try { await widgetHost.call(file.streamId ? 'network.close' : 'files.close',file.streamId ? {streamId:file.streamId} : {fileId: file.fileId}); } catch (_) {}
      finish();
    }
  }
  listen(exportButton,async () => {
    if (active || closed || !lastResult) return;
    const controller = active = new AbortController(), options = {signal:controller.signal};
    activeKind='export';
    const bytes = new TextEncoder().encode(JSON.stringify(lastResult,null,2)+'\n');
    choose.disabled = asset.disabled = network.disabled = exportButton.disabled = copyButton.disabled = true; cancel.disabled = false;
    let resource;
    try {
      resource = await widgetHost.call('exports.begin',{name:'file-statistics.json',sizeBytes:bytes.length},options);
      check(controller);
      for (let offset = 0; offset < bytes.length; offset += 65536) {
        const block = bytes.subarray(offset,offset+65536);
        let binary = ''; for (const byte of block) binary += String.fromCharCode(byte);
        await widgetHost.call('exports.write',{exportId:resource.exportId,offset,bodyBase64:btoa(binary)},options);
        check(controller);
      }
      const saved = await widgetHost.call('exports.save',{exportId:resource.exportId},options);
      check(controller);
      output.textContent = `已导出 ${saved.name} · ${saved.sizeBytes} 字节`;
    } catch(error) {
      if(!closed&&!controller.signal.aborted)output.textContent = error.code === 'CANCELLED' ? '保存未完成确认，请检查所选位置。' : `导出失败：${error.code || 'UNKNOWN'}`;
    } finally {
      activeKind=null;if(!closed)cancel.disabled=true;
      if (resource) try { await widgetHost.call('exports.close',{exportId:resource.exportId}); } catch (_) {}
      finish();
    }
  });
  listen(copyButton,async()=>{
    if(active||closed||!lastResult)return;
    const controller=active=new AbortController();
    activeKind='copy';
    choose.disabled=asset.disabled=network.disabled=exportButton.disabled=copyButton.disabled=true;cancel.disabled=false;
    try{await widgetHost.call('clipboard.writeText',{text:JSON.stringify(lastResult,null,2)},{signal:controller.signal});check(controller);output.textContent='统计已复制到系统剪贴板';}
    catch(error){if(!closed&&!controller.signal.aborted)output.textContent=error.code==='CANCELLED'?'复制未完成确认；统计仍可导出':`复制失败：${error.code||'UNKNOWN'}`;}
    finally{finish();}
  });
  const invalidate=()=>{if(closed)return;active?.abort();lastResult=null;clearPreview();exportButton.disabled=copyButton.disabled=true;output.textContent='配置或权限已变化，请重新统计';};
  const offConfig=widgetHost.on('config.changed',invalidate),offCaps=widgetHost.on('capabilities.changed',invalidate);
  window.addEventListener('pagehide',()=>{
    closed=true;
    for(const [button,handler] of clickHandlers){button.disabled=true;button.removeEventListener('click',handler);}
    clickHandlers.length=0;active?.abort();lastResult=null;clearPreview();offConfig();offCaps();
  },{once:true});
})();
