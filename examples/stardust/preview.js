/* 可重建的静态图片；一项在途任务加最新配色，不逐帧写入缓存。 */
(() => {
  const palettes={mint:['#7aedcf','#dafff5'],violet:['#a796fb','#f3e0ff'],amber:['#f7c070','#fff3d6']};
  function png(bytes) {
    const signature=[137,80,78,71,13,10,26,10];
    if(bytes.length<24||signature.some((value,index)=>bytes[index]!==value))return false;
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    return view.getUint32(16)===256&&view.getUint32(20)===128;
  }
  function encode(bytes) {let value='';for(let offset=0;offset<bytes.length;offset+=8192)value+=String.fromCharCode(...bytes.subarray(offset,offset+8192));return btoa(value);}
  function decode(value) {if(typeof value!=='string'||value.length>1398104)throw Error('Invalid preview');return Uint8Array.from(atob(value),character=>character.charCodeAt(0));}
  async function generate(palette) {
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;
    const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');
    const [glow,light]=palettes[palette];context.strokeStyle=glow;context.lineWidth=.7;context.globalAlpha=.24;
    for(const [x,y,rx,ry,angle] of [[128,64,78,28,-.2],[128,64,54,19,.2]]){
      context.beginPath();context.ellipse(x,y,rx,ry,angle,0,Math.PI*2);context.stroke();
    }
    context.globalAlpha=.85;context.fillStyle=light;context.shadowColor=glow;context.shadowBlur=7;
    for(const [x,y] of [[64,51],[102,38],[154,81],[182,56],[123,74],[92,83]]){context.beginPath();context.arc(x,y,1.2,0,Math.PI*2);context.fill();}
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('PNG unavailable')),'image/png'));
    if(blob.size>1048576)throw Error('Preview too large');
    return new Uint8Array(await blob.arrayBuffer());
  }
  window.createStarPreview=(target,changed)=>{
    let controller=new AbortController();
    let closed=false,pending=false,wanted=null,current=null,url=null,status='unused',cancelImage=null,revision=0;
    const publish=value=>{status=value;changed(value);};
    function release(){target.style.backgroundImage='';target.classList.remove('has-preview');if(url){URL.revokeObjectURL(url);url=null;}}
    async function loadImage(bytes){
      const next=URL.createObjectURL(new Blob([bytes],{type:'image/png'})),image=new Image();
      try{
        await new Promise((resolve,reject)=>{
          let settled=false,timer;
          const finish=success=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=null;image.onerror=null;cancelImage=null;if(!success)image.src='';success?resolve():reject(Error('Image unavailable'));};
          cancelImage=()=>finish(false);
          timer=setTimeout(()=>finish(false),2000);
          image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=next;
        });
        return next;
      }catch(error){URL.revokeObjectURL(next);throw error;}
    }
    async function pump(){
      if(closed||pending||!wanted)return;pending=true;
      const palette=wanted,token=revision,options={signal:controller.signal};wanted=null;publish('loading');
      try{
        const key='preview-v1-'+palette;
        let cached=null,bytes=null,source='hit',cacheAvailable=true;
        try{cached=await widgetHost.call('cache.get',{key},options);}catch{cacheAvailable=false;}
        if(closed||token!==revision)return;
        try{bytes=cached?.found?decode(cached.bodyBase64):null;}catch{}
        if(bytes&&!png(bytes))bytes=null;
        for(let attempt=0;attempt<2;++attempt){
          if(!bytes){
            source='miss';bytes=await generate(palette);if(closed||token!==revision)return;
            if(cacheAvailable)try{await widgetHost.call('cache.put',{key,bodyBase64:encode(bytes)},options);}catch{source='uncached';}
            else source='uncached';
          }
          if(closed||token!==revision)return;
          let next;
          try{next=await loadImage(bytes);}
          catch(error){if(closed||token!==revision)return;if(source==='hit'&&attempt===0){bytes=null;continue;}throw error;}
          if(closed||token!==revision){URL.revokeObjectURL(next);return;}
          release();url=next;target.style.backgroundImage=`url("${url}")`;target.classList.add('has-preview');publish(source);return;
        }
      }catch{if(!closed&&token===revision)publish('unavailable');}
      finally{pending=false;if(!closed&&wanted)pump();}
    }
    return {
      update(palette){if(closed||!palettes[palette]||palette===current)return;++revision;current=palette;controller.abort();controller=new AbortController();cancelImage?.();release();wanted=palette;pump();},
      pause(){if(closed||(status==='paused'&&current===null&&wanted===null))return;++revision;current=null;wanted=null;controller.abort();cancelImage?.();release();publish('paused');},
      close(){closed=true;++revision;wanted=null;controller.abort();cancelImage?.();release();},
      get status(){return status;}
    };
  };
})();
