# 多屏协作：存档是事实，消息是提示

allowMultipleInstances=true 允许同一安装在不同显示器启用；每屏仍最多一份。各实例配置和 KV 独立，安装共享权限与存档。不要新增宿主主副角色，也不要用另一屏消息授予本屏权限。

## 推荐链路

1. 用 saves.load 读取成功快照与修订。
2. 基于业务操作提交 saves.commit，成功才得到新 revision。
3. 可发布 `collaboration.publish({value:{revision}})` 作为变化提示。
4. 其他实例有界轮询 collaboration.get，发现新提示后仍调用 saves.load，不把消息正文当游戏进度应用。

```js
const message = await widgetHost.call('collaboration.get', {afterId}, {signal});
if (message.found) {
  afterId = message.id;
  // 校验业务内容；读取真实存档后再更新页面。
  const snapshot = await widgetHost.call('saves.load', {slot: 'progress'}, {signal});
}
```

代码中的 afterId/signal 由每个消费者维护。snapshot 仍需校验。可见/恢复、关键操作前或合理低频时补读存档，弥补消息丢失，不只依赖提示。

## 消息不是可靠队列

每安装只保留最新一条，最长 30 秒、单条最多 16 KiB；新发布覆盖旧值，慢消费者会漏消息，重启不恢复。每安装每秒最多四次、每分钟六十次发布尝试，不能每帧广播。全局额度和失效规则见[协作协议](../reference/contracts/collaboration.md)。

消息不是存档确认、权限委托、账号共享、云同步或跨安装通信。撤权、重载、停用、包切换和来源文档失效可让记录不可用。SAVE_CONFLICT 按业务重读/合并，不用消息绕过 CAS。

验证两个实例同时写入、消息覆盖/过期、发布响应丢失、恢复补读、撤权和任一文档关闭。只有真实多屏运行才能说明多屏体验，单进程夹具不等于物理验收。
