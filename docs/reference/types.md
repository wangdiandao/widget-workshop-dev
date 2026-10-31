# SDK 类型与机器协议

当前 SDK 0.1.0，hostApiMajor=1、protocolVersion=1。以下内容从宿主唯一来源同步。可下载[类型声明](/sdk/widget-host.d.ts)和[机器协议](/sdk/protocol.json)用于编辑器和工具；它们不能进入组件包。

本页完整列出调用形状；权限、失败、所有权和取消边界仍以[宿主协议](contracts/host-api.md)及关联专题为准。不要根据 TypeScript 通过推定操作已授权或设备已可用。

<<< ../public/sdk/widget-host.d.ts

## 完整功能与限额

两种语言共用同一机器协议。features 只代表宿主支持，不能证明授权、设备或内容实际可用。

<<< ../public/sdk/protocol.json
