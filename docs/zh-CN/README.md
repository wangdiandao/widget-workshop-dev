# Widget Workshop 组件开发文档

本文档面向 Widget Workshop 组件开发者，说明如何从一个本地源码目录创建、调试、校验并发布桌面小组件。组件运行在 WebView2 中，本质上是一个由宿主挂载的透明窗口和其中的 HTML 页面。

## 文档路线

- [快速开始](component-quickstart.md)：从开发者模式到第一个可导入组件。
- [manifest 参考](manifest-reference.md)：组件身份、窗口、预览图、本地化、分类和权限声明。
- [settings 参考](settings-reference.md)：`scripts/settings.json` 生成式设置页。
- [Host API 参考](host-api-reference.md)：`window.widgetWorkshop` 的可用接口、返回值和错误。
- [权限与安全](permissions-and-security.md)：敏感能力、授权边界、文件和网络限制。
- [调试与校验](debugging-and-validation.md)：导入失败、运行时失败和本地验证脚本。
- [Workshop 发布](workshop-publishing.md)：公开发布前的元数据、许可和最终检查。

## 组件开发模型

组件源码目录是开发者编辑的源头。Widget Workshop 导入时会校验该目录，并生成受控的可运行副本。修改 `manifest.json`、`index.html`、预览图、locale 或 settings 后，应重新导入。

```text
my-component/
  manifest.json
  index.html
  preview.png
  locales/
    zh-CN.json
    en-US.json
  scripts/
    settings.json
```

始终必需的是 `manifest.json`、`index.html` 和预览图。`locales/*.json` 只在启用本地化时读取；`scripts/settings.json` 只在 `hasCustomSettings` 为 `true` 时读取。

## 当前公开契约

- 入口文件固定为 `index.html`。
- 预览图支持 `.png`、`.jpg`、`.jpeg`，不支持 SVG。
- 组件名默认来自 `displayName`；启用本地化后可由 locale 文件中的 `title` 覆盖。
- 设置页由 `scripts/settings.json` 生成，每个字段的 `default` 是重置值。
- 运行时 API 只通过 `window.widgetWorkshop` 调用。
- 权限按 manifest 中的 category 声明并由用户授权，不按单个方法授权。
- 组件分类来自 `contracts/component-categories.json`；缺失或为空时在浏览中归为 Other。

## AI 插件与 Skill

仓库内的 Widget Workshop AI 插件位于 `plugins/widget-workshop`。需要 AI 辅助开发组件时，优先使用 `widget-workshop-workflow`，再按任务路由到：

- `widget-workshop-dev`：编写组件目录、manifest、HTML、settings、locale、预览图和运行时代码。
- `widget-workshop-api`：核对 Host API、权限类别、manifest 字段、settings schema 和运行时错误。
- `widget-workshop-code-review`：发布或分享前检查安全性、降级行为、元数据和包结构。

公开上传到 Steam Workshop 是 Widget Workshop 应用内流程，不是单独的 Skill 流程。
