const output = document.querySelector('output');
const button = document.querySelector('button');
const status = document.querySelector('[role="status"]');
const controller = new AbortController();
let active = true;
let busy = false;
let count = 0;

async function increment() {
  if (!active || busy || count === Number.MAX_SAFE_INTEGER) return;
  busy = true;
  button.disabled = true;
  try {
    const next = count + 1;
    await widgetHost.call('storage.set', {key: 'count', value: next}, {signal: controller.signal});
    if (!active) return;
    count = next;
    output.textContent = String(count);
    status.textContent = '已保存';
  } catch (error) {
    if (active) status.textContent = `保存失败：${error.code ?? 'UNAVAILABLE'}`;
  } finally {
    busy = false;
    if (active) button.disabled = count === Number.MAX_SAFE_INTEGER;
  }
}

window.addEventListener('pagehide', () => {
  active = false;
  controller.abort();
  button.disabled = true;
  button.removeEventListener('click', increment);
}, {once: true});

try {
  if (!window.widgetHost) throw new Error('HOST_REQUIRED');
  await widgetHost.ready;
  if (active) {
    const saved = await widgetHost.call('storage.get', {key: 'count'}, {signal: controller.signal});
    if (active) {
      if (saved.found && (!Number.isSafeInteger(saved.value) || saved.value < 0)) {
        throw new Error('INVALID_SAVED_VALUE');
      }
      count = saved.found ? saved.value : 0;
      output.textContent = String(count);
      status.textContent = '每次成功写入后更新计数';
      button.disabled = count === Number.MAX_SAFE_INTEGER;
      button.addEventListener('click', increment);
    }
  }
} catch (error) {
  if (active) status.textContent = `无法读取：${error.code ?? error.message}。请在 Widget Workshop 中运行。`;
}
