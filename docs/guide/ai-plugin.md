# Codex / Claude Code 开发插件

根目录插件把文档、接口和场景经验组合起来。Skills 使用英文，用户开发文档提供中文和英文。插件只指导工作，不添加 MCP 服务、原生命令能力或宿主权限，也不会自动安装示例。

## 安装

Codex：

```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

Claude Code：

```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

本地 Claude 试用 `claude --plugin-dir .`；本地 Codex 先 `codex plugin marketplace add .` 再安装相同名称。CLI 版本不同应核对 --help。

## Skills 与提示词

| Skill | 场景 | 示例任务 |
| --- | --- | --- |
| widget-workshop-dev | 开发、接口查询、调试与审查 | “核对存档 CAS，修复离页后的迟到回调。” |
| widget-workshop-examples | 按需选择桌宠、游戏、信息流和高级方案 | “参考本地开发经验，做可拖动且支持穿透恢复的桌宠。” |

两端的显式技能选择方式以当前客户端为准，也可以直接用自然语言描述场景。技能内用相对路径读取同包 docs、examples 和 SDK 类型，不依赖某台电脑的绝对路径。
