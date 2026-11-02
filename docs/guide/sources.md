# 参考资料

本站以当前 Widget Workshop 的 SDK 0.1.1、hostApiMajor=1、protocolVersion=1 为基线。宿主源码中的 sdk 和所属协议/模块是唯一事实来源；host-snapshot.json 给出同步文件的哈希。

## 格式与兼容

组件包、布局和宿主存档封装当前均为规范 v1，各自独立管理；应用、SDK、作品版本与这些格式编号不联动。新增可选字段且缺省行为不变时不升 schema；删除字段、改变类型、含义、身份或必填结构时升级受影响格式。

新宿主继续读取同一 schema 已发布的合法结构，但不承诺旧宿主读取新增字段。未知字段仍严格拒绝。跨 schema 只接受各协议明确登记并验证的输入和迁移下限，不机械限制为“仅上一代”，也不自动接受任意历史变体。当前包和布局只接受规范 v1，没有自动旧格式转换；带组件来源字段的旧布局不属于该规范。

宿主不改写作者存档正文；作者为自己的 value 定义版本和升级逻辑，不能用宿主 schema 代替业务版本。回退应用二进制不等于数据降级，不能据此恢复授权或游戏进度。

## 官方资料

- [VitePress 1.6.4 部署](https://vuejs.github.io/vitepress/v1/guide/deploy)：docs 构建、仓库 base 与 Pages 工作流。
- [VitePress 多语言](https://vuejs.github.io/vitepress/v1/guide/i18n)：中文默认页与 /en/ 英文版。
- [VitePress 搜索](https://vuejs.github.io/vitepress/v1/reference/default-theme-search)：本地全文索引。
- [OpenAI 插件打包](https://developers.openai.com/plugins/build/plugins)：portable 入口、Codex 清单及市场。
- [Claude Code 清单](https://code.claude.com/docs/en/plugins-reference)与[市场](https://code.claude.com/docs/en/plugin-marketplaces)：共用 skills 与根目录安装。
- [Vite 6.4.5](https://github.com/vitejs/vite/releases/tag/v6.4.5)：构建依赖覆盖所选修补版本。
