/* 作者软预算；不表示宿主对其他作品施加资源硬限制。 */
globalThis.starPolicy = (configuration, system, environment, viewport, suspended) => {
  const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
  const width = Math.max(1, Math.min(4096, finite(viewport.width,520)));
  const height = Math.max(1, Math.min(4096, finite(viewport.height,300)));
  const ratio = Math.max(.25, Math.min(2, finite(viewport.ratio,1), Math.sqrt(1048576 / (width * height))));
  const pixelWidth = Math.max(1,Math.floor(width*ratio)), pixelHeight = Math.max(1,Math.floor(height*ratio));
  const saver = system?.power?.energySaver === true;
  const motionless = configuration.still === true || system?.reducedMotion === true;
  const mode = !environment.visible ? 'hidden' : (suspended || system?.sessionLocked === true) ? 'suspended' : environment.editing ? 'editing' : motionless ? 'static' : 'animated';
  return {width,height,pixelWidth,pixelHeight,mode,
    frameRate:Math.min(saver?10:60,Math.max(10,Math.floor(finite(configuration.frameRate,30)))),
    count:Math.min(saver?24:96,Math.max(16,Math.floor(finite(configuration.stars,48)))),
    palette:['mint','violet','amber'].includes(configuration.palette)?configuration.palette:'mint'};
};
