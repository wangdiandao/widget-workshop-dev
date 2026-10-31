// 一个画布、一个绘制计时器；主文档的状态确认负责背压，不接收资源或原生桥接。
let canvas, context, state, timer, frames = 0, phase = 0, last = 0, lastReport = 0;
let cornerAlpha = 0, centerAlpha = 0;
const palettes = {mint:['122,237,207','218,255,245'],violet:['167,150,251','243,224,255'],amber:['247,192,112','255,243,214']};
const sampleCap=128,drawSamples=[],intervalSamples=[];
let drawCursor=0,intervalCursor=0,previousDraw;
let statusSequence=0,pendingStatus=0;
function summarize(values,intervals=false) {
  const sorted=values.slice().sort((a,b)=>a-b),samples=sorted.length;
  const result={samples,p50Ms:samples?sorted[Math.ceil(samples*.5)-1]:null,
    p95Ms:samples?sorted[Math.ceil(samples*.95)-1]:null,maxMs:samples?sorted[samples-1]:null};
  if(intervals){result.over50Ms=sorted.filter(value=>value>50).length;result.over50Ratio=samples?result.over50Ms/samples:null;}
  return result;
}
function cancel() {
  clearTimeout(timer);timer=undefined;
  // 状态边界不跨接暂停时间；缓冲只保留最近的有限样本。
  drawSamples.length=intervalSamples.length=0;drawCursor=intervalCursor=0;previousDraw=undefined;
}
function report(kind='status', sequence) {
  // 消费者未确认时不构造新摘要；绘制和配置确认仍独立推进。
  if(kind==='status'&&pendingStatus)return;
  const statusId=kind==='status'?(pendingStatus=++statusSequence):undefined;
  postMessage({kind,sequence,statusId,frames,mode:state?.mode ?? 'waiting',count:state?.count ?? 0,
    frameRate:state?.frameRate ?? 0,pixelWidth:canvas?.width ?? 0,pixelHeight:canvas?.height ?? 0,
    cornerAlpha,centerAlpha,timerActive:timer!==undefined,
    timing:{scope:'worker-draw-starts',sampleCap,draw:summarize(drawSamples),intervals:summarize(intervalSamples,true)}});
  lastReport = performance.now();
}
function draw() {
  const started=performance.now();
  if(state.mode==='animated') {
    if(previousDraw!==undefined){intervalSamples[intervalCursor]=Math.max(0,started-previousDraw);intervalCursor=(intervalCursor+1)%sampleCap;}
    previousDraw=started;
  }
  const {width,height,count,palette} = state;
  context.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
  context.clearRect(0,0,width,height);
  const [color,light] = palettes[palette];
  const cx = width*.5, cy = height*.5;
  const glow = context.createRadialGradient(cx,cy,0,cx,cy,height*.34);
  glow.addColorStop(0,`rgba(${color},.12)`);glow.addColorStop(1,`rgba(${color},0)`);
  context.fillStyle=glow;context.fillRect(cx-height*.34,cy-height*.34,height*.68,height*.68);
  context.lineWidth=.7;
  for(let orbit=0;orbit<3;++orbit) {
    context.beginPath();context.ellipse(cx,cy,width*(.22+orbit*.065),height*(.11+orbit*.055),-.2,0,Math.PI*2);
    context.strokeStyle=`rgba(${color},${.11-orbit*.02})`;context.stroke();
  }
  const points=[];
  for(let index=0;index<count;++index) {
    const seed=(index*.61803398875)%1, radius=.18+.8*((index*.754877666)%1);
    const angle=seed*Math.PI*2+phase*(.22+seed*.16);
    points.push({x:cx+Math.cos(angle)*width*.42*radius,y:cy+Math.sin(angle)*height*.34*radius+Math.cos(angle)*height*.07,
      size:index%9===0?2.3:.8+seed*.9,alpha:.35+.55*seed});
  }
  for(let index=0;index<count;++index) {
    const point=points[index];
    for(const offset of [1,7]) {
      const other=points[(index+offset)%count], distance=Math.hypot(point.x-other.x,point.y-other.y);
      if(distance>85)continue;
      context.beginPath();context.moveTo(point.x,point.y);context.lineTo(other.x,other.y);
      context.strokeStyle=`rgba(${color},${.13*(1-distance/85)})`;context.stroke();
    }
    if(index%9===0) {
      const halo=context.createRadialGradient(point.x,point.y,0,point.x,point.y,11);
      halo.addColorStop(0,`rgba(${color},.35)`);halo.addColorStop(1,`rgba(${color},0)`);
      context.fillStyle=halo;context.fillRect(point.x-11,point.y-11,22,22);
    }
    context.beginPath();context.arc(point.x,point.y,point.size,0,Math.PI*2);
    context.fillStyle=`rgba(${light},${point.alpha})`;context.fill();
  }
  ++frames;
  drawSamples[drawCursor]=Math.max(0,performance.now()-started);drawCursor=(drawCursor+1)%sampleCap;
}
function schedule(started) {
  const period=1000/state.frameRate,remaining=period-(performance.now()-started);
  // 绘制占用本帧预算；过载或回调迟到时不追赶积欠帧。
  timer=setTimeout(frame,remaining>0?remaining:period);
}
function frame() {
  timer=undefined;
  if(state?.mode!=='animated')return;
  const now=performance.now();phase+=Math.min(250,Math.max(0,now-last))/1000;last=now;
  draw();schedule(now);
  if(now-lastReport>=1000)report();
}
onmessage=({data})=>{
  if(data.kind==='statusAck') {
    if(pendingStatus&&data.statusId===pendingStatus)pendingStatus=0;
    return;
  }
  if(data.kind==='canvas'&&!canvas) {
    canvas=data.canvas;context=canvas.getContext('2d',{alpha:true});
    if(!context)throw new Error('Canvas 2D unavailable');
    canvas.addEventListener('contextlost',()=>{cancel();postMessage({kind:'failed'});});
    return;
  }
  if(data.kind!=='state'||!canvas)return;
  cancel();state=data.state;
  if(!state||!Number.isInteger(state.count)||state.count<16||state.count>96||
    !Number.isFinite(state.frameRate)||state.frameRate<10||state.frameRate>60||
    !Number.isInteger(state.pixelWidth)||!Number.isInteger(state.pixelHeight)||state.pixelWidth<1||state.pixelHeight<1||
    state.pixelWidth*state.pixelHeight>1048576||!palettes[state.palette])throw new Error('Drawing budget invalid');
  if(canvas.width!==state.pixelWidth||canvas.height!==state.pixelHeight){canvas.width=state.pixelWidth;canvas.height=state.pixelHeight;}
  if(state.mode==='animated'||state.mode==='static') {
    last=performance.now();draw();
    cornerAlpha=context.getImageData(0,0,1,1).data[3];
    centerAlpha=context.getImageData(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1).data[3];
    if(state.mode==='animated')schedule(last);
  }
  report('applied',data.sequence);
};
