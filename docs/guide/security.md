# 权限、资源与联网

组件声明能力不等于获得授权。以下六项是当前 manifest.capabilities 的唯一合法值；全部拒绝也必须能启用并展示可用状态。

| Capability | 作者处理 |
| --- | --- |
| external.open | 打开外部网址；未授权时保留站内信息和明确提示 |
| location | 位置结果可不可用、超时或拒绝；允许手动选择城市等降级 |
| notifications | 即时通知和提醒可被拒绝；组件内状态仍可查看 |
| clipboard | 文本、HTML、图片与文件导入共用授权；无监听或历史 |
| directory.write | 只在用户绑定目录范围内写入；拒绝时保留只读功能 |
| screen.capture | 必须经过系统来源选择；取消和会话失效均为正常分支 |

完整授权范围见[宿主接口](../reference/contracts/host-api.md#权限与基础接口)。网络、系统指标、目录读取、媒体等基础接口无需授权，保留绑定、生命周期、额度与最终投递检查。

## 联网与账号

允许直接 fetch、WebSocket、WebRTC。普通 fetch 受浏览器跨域规则约束。宿主 network.request/open/read/close 为受限 HTTP 代理，返回 Base64 正文与最终 URL；秘密头必须在 `{name,value}` 与 `{name,secretBindingId,prefix?}` 中二选一。

不要为绕过 CORS 引入任意公网代理、远程脚本或内嵌远程页面。第三方登录由组件和服务完成。授权码流程、PKCE、设备码等能否用于所选服务，须查该服务官方文档，不能从示例推定全部支持。

## 资源绑定与失效

目录读取和绑定目标打开是基础功能，但只能使用用户选择的绑定。文件打开/导出保留实际系统选择器与覆盖流程。临时 fileId、exportId、streamId、panelId 等属于指定实例/文档，会失效；不要把它们写入布局、存档或缓存当永久路径。

安装授权后直接调用，不逐次确认复制或外链。监听 capabilities.changed 清除失效展示并取消旧任务；执行中的请求仍可能失败，应处理 CAPABILITY_DENIED、RESOURCE_UNAVAILABLE、CANCELLED 等错误。已交付的数据无法因撤权收回。

日志只记录必要错误码与操作类别，不记录正文、令牌、用户文件内容或完整个人路径。账号例子见[GitHub 登录模块](../reference/modules/github.md)。
