# 场景与解决方案

先从最接近的例子开始，再减少不需要的接口。examples 中的宿主示例保持原始结构，counter 和 information-feed 是本指南的入门示例。所有示例都应通过开发页包检查后按需启用；它们不会自动安装。

可按组件需求组合和扩展这些模式，也可以使用相同接口开发其他类型的组件。

| 想做什么 | 方案 | 源码入口 |
| --- | --- | --- |
| 可点击、可拖动的透明角色 | [桌宠](desktop-pet.md) | examples/transparent-pet |
| 放置成长、边缘工具条式小游戏 | [游戏](game.md) | examples/edge-garden |
| 资讯、RSS 适配器、状态面板 | [信息流](information-feed.md) | examples/information-feed |
| 文件统计、图片处理、导出 | [文件工具](file-tool.md) | examples/file-tool |
| 粒子、重计算、Wasm | [Worker / Canvas](worker-canvas.md) | examples/stardust、worker-canvas |
| 多显示器共享进度 | [协作](collaboration.md) | 在 saves 基础上加 collaboration 提示 |
| 面板、凭据、媒体、采集 | [桌面集成](desktop-integration.md) | 关联协议与任务步骤 |

示例不是框架依赖；新作品使用独立 widgetId。不要复制整个仓库进组件包，也不要把 SDK 类型或机器协议打包进去。
