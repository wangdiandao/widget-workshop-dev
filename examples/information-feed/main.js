import {normalizeFeed, safeHttps, sampleFeed} from './model.js';

const status = document.querySelector('#status');
const items = document.querySelector('#items');
const refreshButton = document.querySelector('#refresh');
const lifetime = new AbortController();
const unsubscribers = [];
let active = true;
let current = null;
let timer = null;
const lifecycleStops = new Set();
let generation = 0;
let config = {};

const canRefresh = () => active && lifecycleStops.size === 0 && widgetHost.context?.visible
  && !widgetHost.context.system.sessionLocked;
function render(model) {
  const fragment = document.createDocumentFragment();
  for (const row of model.items) {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = row.title;
    li.append(text);
    if (row.url) {
      const button = document.createElement('button');
      button.textContent = '打开原文';
      button.dataset.url = row.url;
      button.disabled = !widgetHost.context?.capabilities['external.open'];
      li.append(button);
    }
    fragment.append(li);
  }
  items.replaceChildren(fragment);
}
async function openArticle(url) {
  if (!active) return;
  try {
    await widgetHost.call('external.open', {url}, {signal: lifetime.signal});
  } catch (error) {
    if (active) status.textContent = `无法打开原文：${error.code ?? 'UNAVAILABLE'}`;
  }
}
function cancelCurrent() {
  generation++;
  clearTimeout(timer);
  timer = null;
  current?.abort();
}
function schedule() {
  clearTimeout(timer);
  if (!canRefresh()) return;
  const seconds = Number.isInteger(config.refreshSeconds)
    ? Math.min(3600, Math.max(30, config.refreshSeconds)) : 300;
  timer = setTimeout(() => { void refresh(); }, seconds * 1000);
}
async function refresh() {
  if (!canRefresh()) return;
  cancelCurrent();
  const myGeneration = generation;
  const controller = new AbortController();
  current = controller;
  const deadline = setTimeout(() => controller.abort(), 12000);
  const valid = () => active && generation === myGeneration && !controller.signal.aborted;
  refreshButton.disabled = true;
  status.textContent = '正在刷新…';
  try {
    let model;
    const endpoint = typeof config.endpoint === 'string' ? config.endpoint.trim() : '';
    if (!endpoint) model = normalizeFeed(sampleFeed);
    else {
      const url = safeHttps(endpoint);
      if (!url) throw new Error('HTTPS_REQUIRED');
      const response = await widgetHost.call('network.request', {
        url, method: 'GET', headers: [{name: 'Accept', value: 'application/json'}]
      }, {signal: controller.signal});
      if (!valid()) return;
      if (response.status < 200 || response.status >= 300) throw new Error(`HTTP_${response.status}`);
      if (response.bodyBase64.length > 350000) throw new Error('FEED_TOO_LARGE');
      const bytes = Uint8Array.from(atob(response.bodyBase64), char => char.charCodeAt(0));
      model = normalizeFeed(JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes)));
    }
    if (!valid()) return;
    render(model);
    status.textContent = endpoint ? '已更新' : '包内模拟数据（未访问远端）';
    try {
      await widgetHost.call('storage.set', {key: 'feed', value: model}, {signal: controller.signal});
    } catch (error) {
      if (valid()) status.textContent = `已更新，离线快照未保存：${error.code ?? 'UNAVAILABLE'}`;
    }
  } catch (error) {
    if (active && generation === myGeneration) {
      status.textContent = `刷新失败，保留现有内容：${controller.signal.aborted ? 'TIMEOUT' : error.code ?? error.message}`;
    }
  } finally {
    clearTimeout(deadline);
    if (current === controller) current = null;
    if (active && generation === myGeneration) {
      refreshButton.disabled = !canRefresh();
      schedule();
    }
  }
}
function applyRuntime() {
  if (!active) return;
  if (canRefresh()) { refreshButton.disabled = false; void refresh(); }
  else { cancelCurrent(); refreshButton.disabled = true; }
}
window.addEventListener('pagehide', () => {
  active = false;
  cancelCurrent();
  lifetime.abort();
  refreshButton.disabled = true;
  for (const off of unsubscribers) off();
}, {once: true});
refreshButton.addEventListener('click', () => { void refresh(); }, {signal: lifetime.signal});
items.addEventListener('click', event => {
  const button = event.target instanceof Element ? event.target.closest('button[data-url]') : null;
  if (button && items.contains(button) && !button.disabled) void openArticle(button.dataset.url);
}, {signal: lifetime.signal});

try {
  if (!window.widgetHost) throw new Error('HOST_REQUIRED');
  await widgetHost.ready;
  if (active) {
    config = widgetHost.context.configuration;
    try {
      const saved = await widgetHost.call('storage.get', {key: 'feed'}, {signal: lifetime.signal});
      if (active && saved.found) { render(normalizeFeed(saved.value)); status.textContent = '上次成功快照'; }
    } catch { /* 损坏/缺失的可重建快照不阻止刷新。 */ }
    if (active) {
      unsubscribers.push(
        widgetHost.on('config.changed', value => { config = value; applyRuntime(); }),
        widgetHost.on('visibility.changed', applyRuntime),
        widgetHost.on('system.changed', applyRuntime),
        widgetHost.on('lifecycle.changed', ({state}) => {
          if (state === 'suspending' || state === 'locked') lifecycleStops.add(state);
          if (state === 'resumed') lifecycleStops.delete('suspending');
          if (state === 'unlocked') lifecycleStops.delete('locked');
          applyRuntime();
        }),
        widgetHost.on('capabilities.changed', () => {
          if (!active) return;
          for (const button of items.querySelectorAll('button')) {
            button.disabled = !widgetHost.context.capabilities['external.open'];
          }
        })
      );
      applyRuntime();
    }
  }
} catch (error) {
  if (active) status.textContent = `无法初始化：${error.code ?? error.message}。请在 Widget Workshop 中运行。`;
}
