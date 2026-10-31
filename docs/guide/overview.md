# 认识 Widget Workshop 组件

组件是一份由宿主管理的网页内容包。宿主负责窗口、安装身份、授权、配置与数据投递；作者负责画面、业务规则、交互和失败提示。目标运行环境是受支持且已更新的 Windows 11 x64 与 WebView2，不是普通浏览器标签页。

## 从作品到实例

`widgetId` 是作品 UUID；安装组件是授权和更新对象；实例是在某个显示器上运行的对象。同一安装在同一显示器最多一份实例。`allowMultipleInstances` 默认 false，跨屏也只允许一个启用意图；设为 true 后仍不能在同屏复制同一安装。

开发组件通过宿主开发页显式添加，来源身份为 `development:<widgetId>`。普通本地导入、开发来源和工坊来源不能交叉新增相同 widgetId。由示例创作自己的作品时生成新 UUID，避免和原示例冲突。

## 作者负责什么

| 需要 | 使用方式 |
| --- | --- |
| 页面与画面 | 本地 HTML/CSS/JS、Canvas、WebGL；框架和脚本随包构建 |
| 自身设置 | manifest.configuration、config.get/set、config.changed |
| 每屏轻量状态 | storage.get/set/remove |
| 游戏和工具持久进度 | saves.load/commit，安装共享，作者处理修订冲突 |
| 网络数据 | 直接 fetch/WebSocket/WebRTC，或通用 network 接口 |
| 原生桌面交互 | 通过受限宿主 API；没有任意命令或原生插件入口 |

## 先选择一条路径

第一次开发从[快速开始](quickstart.md)写一个无权限计数卡。需要桌宠时阅读[透明桌宠](../recipes/desktop-pet.md)，游戏阅读[边缘游戏](../recipes/game.md)，数据面板阅读[信息流](../recipes/information-feed.md)。完整名词定义见[术语](../reference/glossary.md)。

内置天气、日历、待办和便签随宿主分发；本仓库 examples 是作者阅读及本地开发验证用源码，不会自动安装，也不是宿主发行包内容。
