/* 单任务 Worker；取消由文档 terminate，解码对象正常路径显式释放。 */
let started = false;
self.onmessage = async ({data}) => {
  if (started) return;
  started = true;
  let bitmap, canvas;
  try {
    const bytes = new Uint8Array(data.bytes), view = new DataView(bytes.buffer);
    const signature = [137,80,78,71,13,10,26,10];
    if (bytes.length < 33 || bytes.length > 8*1024*1024 || !signature.every((n,i)=>bytes[i]===n) ||
        view.getUint32(8)!==13 || view.getUint32(12)!==0x49484452 || ![256,512,1024].includes(data.edge)) throw Error('INVALID_PNG');
    const width=view.getUint32(16), height=view.getUint32(20);
    if (!width || !height || width>4096 || height>4096 || width*height>4194304) throw Error('IMAGE_TOO_LARGE');
    bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
    if(bitmap.width!==width || bitmap.height!==height) throw Error('INVALID_PNG');
    const scale=Math.min(1,data.edge/Math.max(width,height));
    const w=Math.max(1,Math.round(width*scale)),h=Math.max(1,Math.round(height*scale));
    canvas=new OffscreenCanvas(w,h);
    const context=canvas.getContext('2d',{alpha:true});
    if(!context)throw Error('UNAVAILABLE');
    context.drawImage(bitmap,0,0,w,h);
    const blob=await canvas.convertToBlob({type:'image/png'});
    if(blob.type!=='image/png'||blob.size>5*1024*1024||!blob.size)throw Error('OUTPUT_TOO_LARGE');
    self.postMessage({blob,width:w,height:h,sourceWidth:width,sourceHeight:height});
  } catch(error) { self.postMessage({error:['INVALID_PNG','IMAGE_TOO_LARGE','OUTPUT_TOO_LARGE'].includes(error.message)?error.message:'DECODE_FAILED'}); }
  finally { bitmap?.close(); if(canvas){canvas.width=1;canvas.height=1;} }
};
