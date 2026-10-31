# Issue 驱动与宿主同步

本仓库不接受外部贡献，包括代码、文档、翻译和 PR。外部用户只能提交 Issue。维护者按 **Issue → 分支 → PR → 验证 → 合并 → Pages** 完成交付，详细规则见仓库 CONTRIBUTING.md（英文）。

## 变更顺序

先关联本仓库 Issue，说明问题、影响范围和验收。分支编号与 Issue 一致，PR 正文写 Closes #编号。Issue policy 验证 PR 来自仓库所有者、关联 Issue 仍开启且分支匹配；Validate 构建并检查。通过后维护者合并，自动关闭 Issue，main 发布 Pages。

## 同步宿主

```powershell
node tools/sync-host.mjs --source 'E:\repos\Widget Workshop'
node tools/sync-host.mjs --source 'E:\repos\Widget Workshop' --check
npm run check
npm run docs:build
```

工具同步指定协议/模块、SDK 类型/机器协议和五个宿主示例。host-snapshot.json 记录每个来源与生成结果的 SHA-256，不存个人绝对路径。中文参考只转换站点链接及来源提示，不另写协议。英文参考、教程、场景和 Skills 需要人工同步审查；工具不能完成翻译和业务语义检查。

宿主影响作者可见规则、实现、API、生命周期或发布流程时，原项目工作流要求同次交付更新这里。只有内部重构且作者行为不变时可说明无需同步。生成参考或示例应先改宿主来源，不在这里单独修补。

## 构建与部署

VitePress 使用 docs 作为源码，固定仓库 base，构建到 docs/.vitepress/dist。依赖和构建版本由 package-lock 固定，使用 Node.js 22。Pages 采用 GitHub Actions 来源，不把构建产物提交进 main。PR 构建没有部署权限。

新版本涉及 VitePress、Vite 或 GitHub Actions 用法时先查当前官方文档，不能直接按记忆升级。依赖覆盖、真实运行缺口和部署失败要写在 PR，不能把本地成功当远端成功。
