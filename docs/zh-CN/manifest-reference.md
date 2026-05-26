# manifest 参考

`manifest.json` 是组件包的公开契约，必须位于组件根目录，并且必须是 JSON object。

## 示例

```json
{
  "packageId": "com.example.clock",
  "displayName": "Minimal Clock",
  "version": "1.0.0",
  "description": "A Fluent style desktop clock.",
  "preview": "preview.png",
  "windowSize": { "width": 320, "height": 180 },
  "dragArea": { "x": 0, "y": 48, "width": 320, "height": 132 },
  "hasCustomSettings": true,
  "categories": ["desktop_personalization"],
  "windowShape": { "kind": "roundedRectangle", "cornerRadius": 16 },
  "permissions": ["host", "fetch"],
  "locales": {
    "enable": true,
    "default": "zh-CN",
    "supported": ["zh-CN", "en-US"]
  }
}
```

## 必填字段

| 字段 | 说明 |
|---|---|
| `packageId` | 组件唯一 ID。使用小写字母、数字、点和连字符。 |
| `displayName` | 默认组件名称。未启用本地化时，组件列表直接显示该值。 |
| `version` | 组件版本。可使用字母、数字、点、连字符和加号。 |
| `preview` | 包内预览图路径，支持 `.png`、`.jpg`、`.jpeg`。 |
| `windowSize` | 固定窗口尺寸，`width` 和 `height` 必须为正数。 |
| `hasCustomSettings` | 只有存在 `scripts/settings.json` 时才设为 `true`。 |

`description` 建议填写简短说明。上传 Workshop 时可作为默认介绍起点，但公开介绍应按实际发布页面再次检查。

## 包路径与入口

入口文件固定为 `index.html`。manifest 路径必须是包内相对路径，不得使用绝对路径、反斜杠路径或 `..` 路径段。

预览图必须是方形或接近方形的清晰图片，便于在组件列表和 Workshop 浏览页展示。

## 窗口形状

`windowShape` 可选：

```json
{ "kind": "rectangle" }
```

```json
{ "kind": "roundedRectangle", "cornerRadius": 16 }
```

圆角半径应是非负数，并且不超过窗口较短边的一半。

## 拖动区域

`dragArea` 可选。未声明时，整个 `windowSize` 区域可触发拖动；声明后，只有该矩形区域触发拖动。坐标使用组件窗口内逻辑像素。

```json
{ "x": 48, "y": 96, "width": 128, "height": 132 }
```

`x`、`y` 必须大于等于 0，`width`、`height` 必须大于 0，矩形必须完整位于 `windowSize` 内。

## 本地化

未启用本地化时，可省略 `locales`，或显式写为：

```json
"locales": { "enable": false }
```

此时 Widget Workshop 不读取 `locales/*.json`，组件名来自 `displayName`，界面文本应直接写在 `index.html`。

启用本地化时：

- `locales.enable` 为 `true`。
- `locales.default` 必须存在。
- `locales.supported` 必须包含默认语言。
- 每个支持语言都必须有 `locales/<language>.json`。

兼容旧 manifest：如果 `locales` 声明了 `default` 和 `supported` 但没有 `enable`，按启用本地化处理。

locale 文件可用 `title` 字段覆盖组件管理页面显示名称。缺少 `title` 时回退到 `displayName`。

## 分类

| manifest key | 浏览标签 |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| 缺失或为空 | Other |

## 权限

`permissions` 只接受权限类别：`app`、`host`、`process`、`system`、`screen`、`theme`、`power`、`shell`、`dialog`、`clipboard`、`storage`、`files`、`fetch`。

不要声明单个方法，例如 `process.getCpuUsage`。权限按 category 声明和授权。

## 已移除字段

不要使用 `schemaVersion`、`entry`、`initEntry`、`defaultSize`、`sizeLimits`、`capabilities`、`settingsEntry`、`author` 或 `locales.resources`。这些字段会被视为旧包格式并被拒绝。
