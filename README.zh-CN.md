# Widget Workshop · 组件开发指南

为 Widget Workshop 开发组件。从 HTML/CSS/JavaScript 起步，查阅当前宿主协议，也可让 Codex 或 Claude Code 使用仓库根目录的开发插件。

**[English](README.md) · [在线文档](https://wangdiandao.github.io/widget-workshop-dev/) · [快速开始](docs/guide/quickstart.md) · [场景方案](docs/recipes/index.md) · [接口参考](docs/reference/index.md) · [提交 Issue](https://github.com/wangdiandao/widget-workshop-dev/issues/new/choose)**

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

Codex CLI：

```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

Claude Code：

```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

本地试用 Claude Code 可在仓库根目录运行 `claude --plugin-dir .`。Codex 可使用 `codex plugin marketplace add .` 注册本地目录后按上述名称安装；安装后的宿主重新加载方式以当前客户端为准。

使用方式及场景提示词见 [插件指南](docs/guide/ai-plugin.md)。根目录 `plugin.json` 为 portable 入口，`.codex-plugin`、`.claude-plugin` 提供两端入口，`skills/` 只维护一份。

## 目录与维护

| 目录 | 用途 |
| --- | --- |
| docs/guide | 开发流程与常见问题 |
| docs/recipes | 组件开发示例与解决方案 |
| docs/reference | 从宿主生成的协议与模块参考 |
| docs/public/sdk | 仅供开发的类型和机器协议快照，不放进组件包 |
| examples | 可作为源码阅读和宿主本地验证输入的示例 |
| skills | Codex / Claude Code 共用 Skills |
| tools | 同步与静态检查 |

本仓库不接受外部贡献。问题反馈和功能建议请[提交 Issue](https://github.com/wangdiandao/widget-workshop-dev/issues/new/choose)，参见 [Contribution Policy](CONTRIBUTING.md)。

SDK 当前为 0.1.0，protocolVersion / hostApiMajor 为 1。这里的参考是当前宿主快照，不是兼容旧版本的承诺。具体来源文件与 SHA-256 见 host-snapshot.json。
