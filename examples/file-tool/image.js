(() => {
  const get=id=>document.getElementById(id);
  const choose=get('imageChoose'),cancel=get('imageCancel'),save=get('imageSave'),resize=get('imageResize'),edge=get('imageEdge'),preview=get('imagePreview'),status=get('imageStatus');
  let active=null,closed=false,result=null,url=null,source=null;
  const fail=code=>Object.assign(new Error(code),{code});
  const check=c=>{if(closed||c.signal.aborted)throw fail('CANCELLED');};
  function clear(keepSource=false){result=null;if(!keepSource)source=null;if(url)URL.revokeObjectURL(url);url=null;preview.removeAttribute('src');preview.hidden=true;}
  function controls(){choose.disabled=edge.disabled=closed||!!active;cancel.disabled=closed||!active;save.disabled=closed||!!active||!result;resize.disabled=closed||!!active||!source;}
  const close=async(method,params)=>{try{await widgetHost.call(method,params);}catch(_){}};
  function processImage(bytes,c,target){
    return new Promise((resolve,reject)=>{
      let worker,timer,done=false;
      const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);c.signal.removeEventListener('abort',abort);if(worker){worker.onmessage=worker.onerror=worker.onmessageerror=null;worker.terminate();}error?reject(error):resolve(value);};
      const abort=()=>finish(fail('CANCELLED'));
      c.signal.addEventListener('abort',abort,{once:true});
      try{
        check(c);worker=new Worker('image-worker.js');
        worker.onerror=worker.onmessageerror=()=>finish(fail('DECODE_FAILED'));
        worker.onmessage=({data})=>{
          if(data?.error)return finish(fail(data.error));
          if(!(data?.blob instanceof Blob)||data.blob.type!=='image/png'||!data.blob.size||data.blob.size>5*1024*1024||
             !Number.isInteger(data.width)||!Number.isInteger(data.height)||data.width<1||data.height<1||Math.max(data.width,data.height)>target)return finish(fail('INVALID_RESULT'));
          finish(null,data);
        };
        timer=setTimeout(()=>finish(fail('TIMEOUT')),10000);
        worker.postMessage({bytes:bytes.buffer,edge:target},[bytes.buffer]);
      }catch(error){finish(error);}
    });
  }
  async function run(exporting,regenerating=false){
    if(closed||active||(exporting&&!result)||(regenerating&&!source))return;
    const original=regenerating?source:null,c=active=new AbortController(),options={signal:c.signal},target=Number(edge.value);
    c.signal.addEventListener('abort',()=>{if(!closed)status.textContent='操作已取消或超时；若正在保存，请检查所选位置。';},{once:true});
    let file,resource,timer;
    controls();if(!exporting)clear(regenerating);
    status.textContent=exporting?'正在导出 PNG…':regenerating?'正在重新生成 PNG…':'请选择 PNG 图片';
    try{
      await widgetHost.ready;check(c);
      if(exporting){
        const blob=result.blob;
        resource=await widgetHost.call('exports.begin',{name:'image-thumbnail.png',sizeBytes:blob.size},options);check(c);
        for(let offset=0;offset<blob.size;offset+=65536){
          const bytes=new Uint8Array(await blob.slice(offset,offset+65536).arrayBuffer());check(c);
          let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);
          await widgetHost.call('exports.write',{exportId:resource.exportId,offset,bodyBase64:btoa(binary)},options);check(c);
          if(offset+bytes.length<blob.size)await new Promise(resolve=>setTimeout(resolve,25));
        }
        const saved=await widgetHost.call('exports.save',{exportId:resource.exportId},options);check(c);
        status.textContent=`已导出 ${saved.name} · ${saved.sizeBytes} 字节`;
      }else{
        let bytes,input;
        if(regenerating){
          timer=setTimeout(()=>c.abort(),30000);
          bytes=new Uint8Array(await original.arrayBuffer());check(c);input=original;
        }else{
          file=await widgetHost.call('files.open',{},options);check(c);
          if(!Number.isSafeInteger(file.sizeBytes)||file.sizeBytes<33||file.sizeBytes>8*1024*1024)throw fail('IMAGE_TOO_LARGE');
          timer=setTimeout(()=>c.abort(),30000);
          bytes=new Uint8Array(file.sizeBytes);let offset=0;
          while(offset<bytes.length){
            const block=await widgetHost.call('files.read',{fileId:file.fileId,offset,length:Math.min(65536,bytes.length-offset)},options);check(c);
            if(typeof block.bodyBase64!=='string'||block.bodyBase64.length>87384)throw fail('INVALID_READ');
            const binary=atob(block.bodyBase64);
            if(!binary.length||binary.length>65536||binary.length>bytes.length-offset||typeof block.eof!=='boolean')throw fail('INVALID_READ');
            for(let i=0;i<binary.length;i++)bytes[offset+i]=binary.charCodeAt(i);
            offset+=binary.length;
            if(block.eof!==(offset===bytes.length))throw fail('INVALID_READ');
            if(!block.eof)await new Promise(resolve=>setTimeout(resolve,25));check(c);
          }
          await close('files.close',{fileId:file.fileId});file=null;check(c);
          // 只保留一份有界源快照；重算从原图生成，不累积缩略图或重开文件。
          input=new Blob([bytes],{type:'image/png'});
        }
        status.textContent='正在生成 PNG 缩略图…';
        const data=await processImage(bytes,c,target);check(c);
        url=URL.createObjectURL(data.blob);source=input;result=data;preview.src=url;preview.hidden=false;
        status.textContent=`PNG 已就绪 · ${data.sourceWidth} × ${data.sourceHeight} → ${data.width} × ${data.height} · ${data.blob.size} 字节`;
      }
    }catch(error){if(!closed&&!c.signal.aborted)status.textContent=error.code==='CANCELLED'?'已取消':'图片处理失败：'+(error.code||'UNKNOWN');}
    finally{
      clearTimeout(timer);
      if(file)await close('files.close',{fileId:file.fileId});
      if(resource)await close('exports.close',{exportId:resource.exportId});
      active=null;controls();
    }
  }
  const onChoose=()=>run(false),onSave=()=>run(true),onResize=()=>run(false,true);
  const onCancel=()=>{if(!active||closed)return;active.abort();status.textContent='已取消；若正在保存，请检查所选位置。';};
  choose.addEventListener('click',onChoose);save.addEventListener('click',onSave);cancel.addEventListener('click',onCancel);
  resize.addEventListener('click',onResize);edge.addEventListener('change',onResize);
  const invalidate=()=>{if(closed)return;active?.abort();clear();controls();status.textContent='配置或权限已变化，请重新选择图片';};
  const offConfig=widgetHost.on('config.changed',invalidate),offCaps=widgetHost.on('capabilities.changed',invalidate);
  window.addEventListener('pagehide',()=>{
    closed=true;active?.abort();clear();controls();offConfig();offCaps();
    choose.removeEventListener('click',onChoose);save.removeEventListener('click',onSave);cancel.removeEventListener('click',onCancel);
    resize.removeEventListener('click',onResize);edge.removeEventListener('change',onResize);
  },{once:true});
  controls();
})();
