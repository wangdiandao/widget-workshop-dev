# Workshop 发布

Steam Workshop 发布使用的仍是本地校验过的组件源码目录。只有在包可干净导入、并且能用最终 manifest permission category 列表运行后，才准备发布。

## 发布清单

- manifest 字段完整，并准确描述组件。
- `displayName`、`description`、`preview` 和 `categories` 适合公开浏览。
- 用于上传的 Steam 账号就是公开 Workshop 作者。
- 组件有清晰可读的 `.png`、`.jpg` 或 `.jpeg` 预览图；不再支持 SVG 预览图。
- 组件不依赖机器本地路径。
- locale 文件覆盖 `locales.supported` 声明的语言。
- settings 默认值适合全新安装。
- Host API 失败时组件能降级显示。
- 包内容遵守 Steam Subscriber Agreement，并满足 EULA 或第三方许可要求。

## 分类映射

Workshop 浏览使用 manifest category key：

| manifest key | Steam Workshop tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| 缺失或为空 | Other |

## 上传前

从干净的组件文件夹执行一次本地导入。打开导入后的组件，操作 settings，只授予请求的 permission category，并验证组件使用到的每一条 Host API 路径。

上传后，再安装 Workshop 副本，确认发布包与本地副本行为一致。
