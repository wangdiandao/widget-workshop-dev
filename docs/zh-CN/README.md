# Widget Workshop 组件开发者文档

本文档完全面向 component developer，也就是 Widget Workshop 组件开发者。内容覆盖组件包结构、manifest 契约、生成式 settings schema、Host API 权限、校验流程，以及发布到 Steam Workshop 前必须确认的事项。

## 组件包结构

组件源码目录是唯一编辑入口。Widget Workshop 会从该目录导入一个受控的可运行副本，因此请修改源码目录，然后重新导入。

```text
manifest.json
index.html
preview.png
locales/zh-CN.json
locales/en-US.json
scripts/settings.json
scripts/settings.default.json
```

始终必需的是 `manifest.json`、`index.html` 和预览文件。locale 与 settings 文件只在 manifest 声明对应能力时必需。

## 阅读路径

- 先读 [组件快速开始](component-quickstart.md)，完成创建、校验、导入和测试。
- 实现时参考 [manifest 参考](manifest-reference.md)、[settings 参考](settings-reference.md) 和 [Host API 参考](host-api-reference.md)。
- 使用 `fetch`、files、clipboard、shell、system、screen、theme、process 或 power API 前，先读 [权限与安全](permissions-and-security.md)。
- 本地导入或运行行为异常时，读 [调试与校验](debugging-and-validation.md)。
- 准备公开发布前，读 [Workshop 发布](workshop-publishing.md)。

## AI 插件与 Skill

仓库内的 Widget Workshop AI plugin 位于 `plugins/widget-workshop`。`widget-workshop-dev` agent 是面向组件创作者的 Skill 编排入口；需要让 Codex 帮助实现或审查组件时，优先调用它，由它按任务加载以下 Skill：

- `widget-workshop-setup`：插件安装、仓库结构、前置条件和验证命令定位。
- `widget-workshop-component-authoring`：组件源码目录、`manifest.json`、settings、locales、preview、导入和重新导入。
- `widget-workshop-host-api`：`window.widgetWorkshop` 调用、权限 category、返回结构和运行时边界。
- `widget-workshop-validation`：仓库、插件、文档、契约和组件包验证门禁。
- `widget-workshop-troubleshooting`：导入、settings、权限、fetch、文件 token、shell 和运行时错误排查。
- `widget-workshop-review`：发布前检查 manifest、settings、Host API、权限、localization、preview 和降级行为。

Steam Workshop 上传是 Widget Workshop 应用内流程，不单独作为 Skill；需要公开分享时，先按 [Workshop 发布](workshop-publishing.md) 准备组件元数据、preview、分类、权限和许可信息。

## 当前组件接口面

- 入口文件：`index.html`。
- 预览格式：`.png`、`.jpg`、`.jpeg`。不再支持 SVG 预览图。
- 设置 schema：`scripts/settings.json`，可选默认值文件为 `scripts/settings.default.json`。
- 运行时 API：`window.widgetWorkshop`。
- 权限模型：manifest 的 permission category 声明，加上宿主授权。
- 市场分类：Dashboard、Productivity、Desktop Personalization、Workflow Integrations、Device Environment、Lifestyle 和 Other。

## 文档目录

- [组件快速开始](component-quickstart.md)
- [manifest 参考](manifest-reference.md)
- [settings 参考](settings-reference.md)
- [Host API 参考](host-api-reference.md)
- [权限与安全](permissions-and-security.md)
- [调试与校验](debugging-and-validation.md)
- [Workshop 发布](workshop-publishing.md)
