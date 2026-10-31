# 生命周期与调试

`widgetHost.ready` 是共享握手 Promise。页面离开时让自己失效，取消自己的请求并解除订阅；迟到的成功或错误都不能修改旧 DOM。`on` 返回解除函数，`call` 接受 `{signal}`。信号取消不等于所有已经发生的副作用被撤回。

## 建立单个任务槽

```js
let active = true;
let current = null;
let generation = 0;
const off = widgetHost.on('config.changed', () => { void refresh(); });

async function refresh() {
  const myGeneration = ++generation;
  current?.abort();
  const controller = new AbortController();
  current = controller;
  try {
    await widgetHost.ready;
    if (!active || controller.signal.aborted) return;
    const value = await widgetHost.call('system.metrics.get', {}, {
      signal: controller.signal
    });
    if (active && myGeneration === generation) render(value);
  } catch (error) {
    if (active && myGeneration === generation
      && !controller.signal.aborted) showError(error.code ?? 'UNAVAILABLE');
  } finally {
    if (current === controller) current = null;
  }
}

window.addEventListener('pagehide', () => {
  active = false;
  generation++;
  current?.abort();
  off();
}, {once: true});
```

render/showError 是作者自己的视图函数。周期任务采用“本次完成再安排下次”，限制超时、数据量、重试和并发；不要用固定 interval 累积未完成调用。WebSocket 也要限制消息与排队长度，在离页时关闭。

## 可见、暂停、锁定、停用

隐藏继续运行；如果组件希望隐藏时减少工作，应主动暂停绘制或取消轮询。不要把 visible=false 当作卸载。停用释放运行资源；断屏保留启用意图；全局暂停尝试挂起，恢复不应积压历史帧。监听 visibility.changed、system.changed、lifecycle.changed，依据实际状态控制任务。

动画同时考虑 reducedMotion、energySaver、sessionLocked、文档可见性和编辑状态。省电可降帧，减少动画静态绘制，恢复只提交最新状态。普通 pointercancel 和宿主规范化取消都要结束拖动；规范化取消 isTrusted=false，不能作为物理输入或用户手势证据。

## 调试路径

开发页选择已启用且就绪的显示器实例，打开调试工具。检查包错误先用“检查组件包”；脚本错误看对应 WebView；重载失败先确认入口/路径/manifest，再确认 SDK 调用。未保存配置草稿会暂缓自动激活，先完成保存或继续编辑选择。

| 现象 | 先检查 |
| --- | --- |
| 普通浏览器 widgetHost 不存在 | 在真实宿主运行；浏览器只用于画面预览 |
| 添加提示重复 | widgetId 已被其他来源安装；新作品使用新 UUID |
| 新文件未运行 | 是否绑定构建输出，是否自动重载关闭或存在草稿 |
| CAPABILITY_UNDECLARED / DENIED | 清单声明与安装授权；默认拒绝时仍能启用 |
| SAVE_CONFLICT | 另一个实例或操作已提交，重读再做业务合并 |
| RESOURCE_UNAVAILABLE | 句柄/绑定/文档已失效，或系统功能不可用 |
| METHOD_NOT_FOUND | 当前宿主支持范围；核对 features 和 SDK 快照 |

`compatibility()` 把宿主支持、API 存在、真实探测和未实测设备分开。API 存在不等于音频播放、Worker 执行、手柄或物理触摸已可用。细节见[宿主 API](../reference/contracts/host-api.md)与[运行模块](../reference/modules/runtime.md)。
