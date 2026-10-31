# 配置与数据：先选归属

同一安装可以在不同显示器有不同外观，但进度需要一致。先区分数据归属，再选择接口，避免把游戏进度写到布局或把秘密写到分享配置。

| 数据 | 接口 | 归属与恢复 |
| --- | --- | --- |
| 颜色、布局模式、刷新间隔 | config.get/set | 每屏实例配置；布局可保存/恢复，字段遵循配置协议 |
| 计数、每屏临时偏好 | storage.get/set/remove | 每实例 KV；不是安装共享，也不随布局回退 |
| 游戏进度、文档正文 | saves.load/commit | 同安装所有实例共享；修订 CAS，保留上一成功版本 |
| 可重新下载的二进制 | cache.* | 实例可回收缓存；未命中是正常状态 |
| 刷新提示、最新业务消息 | collaboration.* | 安装内临时最新值；不保证历史或持久化 |
| 第三方访问令牌 | credentials.* 或用户秘密绑定 | 不进入配置分享、日志、布局或组件包 |

## 配置是字段数组

```json
{
  "key": "refreshSeconds",
  "label": "刷新间隔",
  "type": "integer",
  "default": 60,
  "minimum": 15,
  "maximum": 3600,
  "shareable": true
}
```

将该字段放进 manifest.configuration。读取 ready.configuration 或 config.get，监听 config.changed；变更间隔时取消原定时器再安排下一次，不叠加轮询。字段类型、默认值、分享及资源绑定见[配置协议](../reference/contracts/configuration.md)。

## 存档用修订比较

```js
const loaded = await widgetHost.call('saves.load', {slot: 'progress'}, {signal});
const saved = await widgetHost.call('saves.commit', {
  slot: 'progress',
  expectedRevision: loaded.current?.revision ?? null,
  value: {schemaVersion: 1, coins: 20}
}, {signal});
```

代码展示调用形状，`signal` 由当前业务任务提供。作者须验证 loaded.current.value 的业务结构；不能直接将不可信 JSON 当作自己的模型。SAVE_CONFLICT 时重读并按业务合并或提示选择，不盲目改成最新修订覆盖，也不无限重试。响应丢失时先 load 确认；取消不撤回已经提交的副作用。

实例 KV 单值 256 KiB、总量 16 MiB；共享存档的独立额度见[存档协议](../reference/contracts/saves.md)。不按每帧保存；按检查点、合并变更和有界退出机会保存。布局和组件包回退不会回退这些持久进度。
