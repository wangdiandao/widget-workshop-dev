# Workshop 发布

Steam Workshop 发布使用同一个本地组件源码目录。只有在包能干净导入，并且按最终权限和设置运行正常后，才准备公开上传。

## 发布前清单

- manifest 字段完整，`displayName`、`description`、`preview` 和 `categories` 适合公开浏览。
- 预览图清晰、方形或接近方形，格式为 `.png`、`.jpg` 或 `.jpeg`。
- 包不依赖开发机器的本地绝对路径。
- 启用本地化时，locale 文件覆盖 `locales.supported`；未启用时，公开文本来自 `displayName`、`description` 和 `index.html`。
- settings 默认值适合全新安装。
- Host API 失败时组件能降级显示。
- 权限声明与实际使用能力一致，不申请无关 category。
- 包内容遵守 Steam Subscriber Agreement、EULA 和第三方许可要求。

## 分类映射

Workshop 浏览使用 manifest category key：

| manifest key | Workshop tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| 缺失或为空 | Other |

## 上传前测试

从干净副本执行一次本地导入。打开导入后的组件，操作 settings，只授予最终 manifest 中声明的 permission category，并验证组件实际用到的每一条 Host API 路径。

上传后，再安装 Workshop 副本，确认公开包与本地包行为一致。

Workshop 作者身份来自上传所用 Steam 账号，不来自 manifest 字段。
