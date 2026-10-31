# 来源与支持范围

本站以当前 Widget Workshop 的 SDK 0.1.0、hostApiMajor=1、protocolVersion=1 为基线。宿主源码中的 sdk 和所属协议/模块是唯一事实来源；host-snapshot.json 给出同步文件的哈希。发布前协议允许破坏性变更，不能据此承诺旧版本兼容。

## 官方资料

- [VitePress 1.6.4 部署](https://vuejs.github.io/vitepress/v1/guide/deploy)：docs 构建、仓库 base 与 Pages 工作流。
- [VitePress 多语言](https://vuejs.github.io/vitepress/v1/guide/i18n)：中文默认页与 /en/ 英文版。
- [VitePress 搜索](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)：本地全文索引。
- [OpenAI 插件打包](https://developers.openai.com/plugins/build/plugins)：portable 入口、Codex 清单及市场。
- [Claude Code 清单](https://code.claude.com/docs/en/plugins-reference)与[市场](https://code.claude.com/docs/en/plugin-marketplaces)：共用 skills 与根目录安装。
- [Vite 6.4.5](https://github.com/vitejs/vite/releases/tag/v6.4.5)：构建依赖覆盖所选修补版本。

本次 Context7 文档查询返回月度额度耗尽，因此改用上述官方文档，并核对本机 codex/claude CLI 的 help。宿主私有 API 以本机来源为准，没有假称从公共文档核实。

## 验证的含义

静态检查覆盖哈希、文件引用、基本包字段、插件元数据、脚本语法和类型用法；站点构建检查 VitePress 页面。宿主只读包校验、真实运行、物理输入、多屏、音频或采集设备是不同层次，应分别报告。examples 来自宿主不表示本次已在全部环境重新验收。
