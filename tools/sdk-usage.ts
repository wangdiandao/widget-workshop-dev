// 针对教程使用的参数与返回值做真实类型检查；不执行宿主调用。
async function sdkUsage(signal: AbortSignal) {
  const context = await widgetHost.ready;
  const off = widgetHost.on('visibility.changed', ({visible}) => { void visible; });
  const loaded = await widgetHost.call('saves.load', {slot: 'progress'}, {signal});
  await widgetHost.call('saves.commit', {
    slot: 'progress', expectedRevision: loaded.current?.revision ?? null,
    value: {schemaVersion: 1, coins: 1}
  }, {signal});
  await widgetHost.call('storage.get', {key: 'feed'}, {signal});
  await widgetHost.call('window.setInputRegions', {regions: [{x: 0, y: 0, width: 100, height: 100}]}, {signal});
  await widgetHost.call('network.request', {url: 'https://example.com/feed.json', method: 'GET', headers: []}, {signal});
  await widgetHost.call('collaboration.publish', {value: {revision: 'example'}}, {signal});
  void context; off();
}
void sdkUsage;
