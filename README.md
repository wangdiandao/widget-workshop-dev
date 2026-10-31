# Widget Workshop · 组件开发指南

为 Widget Workshop 编写桌宠、游戏、信息流和桌面工具。从 HTML/CSS/JavaScript 起步，查阅当前宿主协议，也可让 Codex 或 Claude Code 使用仓库根目录的开发插件。

**[English](#english) · [在线文档](https://wangdiandao.github.io/widget-workshop-dev/) · [快速开始](docs/guide/quickstart.md) · [场景方案](docs/recipes/index.md) · [接口参考](docs/reference/index.md) · [提交 Issue](https://github.com/wangdiandao/widget-workshop-dev/issues/new/choose)**

仓库只保留两个英文 Skills：开发（含接口与审查）和示例（按需加载场景与本地开发经验）。[本地开发经验](docs/guide/lessons.md)整理了源码可核对的 11 条处理模式。

## 本地文档

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run check
npm run docs:dev
```

发布前运行 `npm run docs:build`；`npm run docs:preview` 预览产物。GitHub Actions 在 main 上构建并部署到 GitHub Pages，PR 只检查、不发布。站点基础路径为 `/widget-workshop-dev/`。

## 安装开发插件

本仓库根目录就是插件，不需要进入 plugins 子目录。插件包含 Skills、文档、类型参考和示例，不需要 API Key，也没有 MCP 服务。安装不会自动安装或启用任何桌面组件。

Codex CLI（本机命令已核对；不同版本以 `codex plugin --help` 为准）：

```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

Claude Code：

```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

本地试用 Claude Code 可在仓库根目录运行 `claude --plugin-dir .`。Codex 可使用 `codex plugin marketplace add .` 注册本地目录后按上述名称安装；安装后的宿主重新加载方式以当前客户端为准。本次仓库检查不代表已经在你的客户端完成安装。

使用方式及场景提示词见 [插件指南](docs/guide/ai-plugin.md)。根目录 `plugin.json` 为 portable 入口，`.codex-plugin`、`.claude-plugin` 提供两端入口，`skills/` 只维护一份。

## 目录与维护

| 目录 | 用途 |
| --- | --- |
| docs/guide | 开发流程与常见问题 |
| docs/recipes | 桌宠、游戏、信息流、文件、Worker、多屏和桌面集成方案 |
| docs/reference | 从宿主生成的协议与模块参考 |
| docs/public/sdk | 仅供开发的类型和机器协议快照，不放进组件包 |
| examples | 可作为源码阅读和宿主本地验证输入的示例 |
| skills | Codex / Claude Code 共用 Skills |
| tools | 同步与静态检查 |

本仓库不接受外部贡献，外部用户只能提 Issue。维护者采用 **Issue → 分支 → PR → 检查 → 合并 → Pages**，详见 [Maintenance Policy](CONTRIBUTING.md)。宿主规范或实现影响作者时必须同时更新这里。同步入口：

```powershell
node tools/sync-host.mjs --source 'E:\repos\Widget Workshop'
node tools/sync-host.mjs --source 'E:\repos\Widget Workshop' --check
npm run check
npm run docs:build
```

SDK 当前为 0.1.0，protocolVersion / hostApiMajor 为 1。这里的参考是当前宿主快照，不是兼容旧版本的承诺。具体来源文件与 SHA-256 见 host-snapshot.json；维护方法见 [同步说明](docs/guide/maintenance.md)。

## English

Widget Workshop developer documentation and a root-level Codex/Claude Code plugin for desktop pets, games, information feeds and tools.

**[English documentation](https://wangdiandao.github.io/widget-workshop-dev/en/) · [Quickstart](docs/en/guide/quickstart.md) · [Recipes](docs/en/recipes/index.md) · [Local-development lessons](docs/en/guide/lessons.md) · [API reference](docs/en/reference/index.md)**

### Documentation

Use Node.js 22 or newer. Run `npm ci`, `npm run check` and `npm run docs:dev`. Build with `npm run docs:build` and preview with `npm run docs:preview`. Main deploys to GitHub Pages through Actions; PRs validate without deploying. Chinese pages live at the site root and English pages at /en/.

### Plugin installation

The repository root is the plugin. It bundles two English Skills: **widget-workshop-dev** for development/API lookup/debugging/review, and **widget-workshop-examples** for routed recipes and lessons. It adds no MCP server, account connection or automatic widget installation.

```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

In Claude Code:

```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

For local Claude testing use `claude --plugin-dir .`; for Codex use `codex plugin marketplace add .` followed by the same install selector. Check installed CLI help for version-specific behavior. Repository checks do not mean a plugin has already been installed or invoked in your client.

### Maintenance and sources

**External contributions are not accepted. External users may only open Issues.** The owner follows Issue → branch → PR → checks → merge → Pages; see [Maintenance Policy](CONTRIBUTING.md). AGENTS.md is local-only and ignored; CLAUDE.md is not distributed.

The host SDK/contract files are authoritative. Run `node tools/sync-host.mjs --source "E:/repos/Widget Workshop"`, then the same command with `--check`, `npm run check` and `npm run docs:build`. Generated references, declarations, machine protocol and five host examples have source/output hashes in host-snapshot.json. Review both language editions and Skills whenever host behavior changes.

SDK baseline: 0.1.0; protocolVersion/hostApiMajor: 1. Do not bundle the SDK into components or promise legacy compatibility. Static checks are separate from strict host validation, WebView execution, physical input and multi-monitor/device acceptance. See [Sources and scope](docs/en/guide/sources.md) and [Third-party notices](THIRD_PARTY_NOTICES.md).
