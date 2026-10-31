// Worker 无原生桥接，只接收当前主文档的有界计算输入。
let canvas, mode = 'hidden', timer, frameRate = 30, frames = 0;
function frame() {
  timer=undefined;
  if(!canvas || !['animated','static'].includes(mode))return;
  {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6de6c5';
    ctx.beginPath();
    ctx.arc(22 + (Date.now() / 15) % (canvas.width - 44), 35, 16, 0, Math.PI * 2);
    ctx.fill();
    ++frames;
  }
  if(mode==='animated')timer = setTimeout(frame,1000 / frameRate);
}
self.onmessage = ({data}) => {
  if (data.kind === 'canvas') { canvas = data.canvas; clearTimeout(timer); frame(); }
  if (data.kind === 'presentation') {
    if(!['animated','static','hidden','paused'].includes(data.mode)||!Number.isInteger(data.frameRate)||data.frameRate<10||data.frameRate>60)return;
    mode=data.mode;frameRate=data.frameRate;
    clearTimeout(timer);timer=undefined;frame();
    self.postMessage({kind:'presentation',mode,frames,timerActive:timer!==undefined});
  }
  if (data.kind === 'compute') {
    if (!Array.isArray(data.values) || !data.values.length || data.values.length > 10000 ||
        data.values.some(value => typeof value !== 'number' || !Number.isFinite(value))) return;
    const sum = data.values.reduce((total, value) => total + value, 0);
    self.postMessage(Number.isFinite(sum)?{kind:'computed',id: data.id, count: data.values.length, sum, mean: sum / data.values.length}:{kind:'computed',id:data.id,error:'INVALID_ARGUMENT'});
  }
};
