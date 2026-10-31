/* 经济规则与呈现分离；计算量不随离线秒数增长。 */
(() => {
  const fresh = (now) => ({lastAt:now, partialMs:0, gold:0, xp:0, seeds:0, skill:0, paused:false});
  const valid = value => value && ['lastAt','partialMs','gold','xp','seeds','skill'].every(key =>
    Number.isSafeInteger(value[key]) && value[key] >= 0 && (key==='lastAt' || value[key] <= 1e12)) &&
    value.partialMs < 10000 && value.skill <= 20 && typeof value.paused === 'boolean';
  function settle(value, now) {
    if (!valid(value)) throw new Error('SAVE_DATA_INVALID');
    const raw = widgetHost.elapsedSince(value.lastAt,{now,maxMs:Number.MAX_SAFE_INTEGER});
    const elapsed = {elapsedMs:Math.min(28800000,raw.elapsedMs),clockMovedBack:raw.clockMovedBack,capped:raw.elapsedMs>28800000};
    const next = {...value, lastAt:Math.max(value.lastAt,now)};
    if (!value.paused) {
      const total = value.partialMs + elapsed.elapsedMs, rounds = Math.floor(total/10000);
      next.partialMs = total % 10000;
      next.gold = Math.min(1e12,value.gold + rounds*(2+value.skill));
      next.xp = Math.min(1e12,value.xp + rounds*3);
      next.seeds = Math.min(1e12,value.seeds + rounds);
    }
    return {value:next, ...elapsed};
  }
  window.gardenSimulation = {fresh,valid,settle};
})();
