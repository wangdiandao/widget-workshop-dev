# manifest 参考

`manifest.json` 定义 Widget Workshop 组件的公开包契约。该文件必须位于包根目录，并且必须是 JSON object。

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
    "default": "zh-CN",
    "supported": ["zh-CN", "en-US"]
  }
}
```

## 必填字段

- `packageId`：稳定的小写身份标识。只能使用小写字母、数字、点和连字符。
- `displayName`：在 Widget Workshop 中显示的名称。
- `version`：组件版本。可使用字母、数字、点、连字符和加号。
- `preview`：包内预览图片。支持 `.png`、`.jpg`、`.jpeg`；不再支持 SVG 预览图。
- `windowSize`：固定窗口尺寸，`width` 和 `height` 必须是正有限数。
- `hasCustomSettings`：只有存在 `scripts/settings.json` 时才设为 `true`。

建议为本地开发与 Workshop 发布填写 `description`。Workshop 作者由上传该项目的 Steam 账号决定，不由 `manifest.json` 声明。

## 入口与包路径

入口文件始终是 `index.html`。manifest 中的路径必须留在组件包内。不要为预览或其他包资源使用绝对路径或 `..` 路径段。

## 窗口形状

`windowShape` 可选。支持两种形式：

```json
{ "kind": "rectangle" }
```

```json
{ "kind": "roundedRectangle", "cornerRadius": 16 }
```

圆角矩形的 `cornerRadius` 必须是有限、非负，并且不能超过较短窗口边的一半。

## 拖动区域

`dragArea` 可选。未声明时，未锁定状态下整个 `windowSize` 显示区域都可以触发拖动。声明后，只有该矩形区域会触发拖动；区域外内容仍会显示，并跟随组件窗口移动。

使用组件窗口内的逻辑像素：

```json
{ "x": 48, "y": 96, "width": 128, "height": 132 }
```

`x` 和 `y` 必须是大于等于 `0` 的有限数，`width` 和 `height` 必须是正有限数。矩形必须完整位于 `windowSize` 内，否则 manifest 校验失败。

## 本地化契约

声明 `locales` 时：

- `locales.default` 必填。
- `locales.supported` 必须包含默认语言。
- 每个 supported 语言都会解析为 `locales/<language>.json`。

推荐使用 `zh-CN`、`en-US` 这类安全语言标签。

## 分类标签

| manifest key | 显示标签 |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| 缺失或为空 | Other |

## 权限类别

可接受的 permission category 值包括 `app`、`host`、`process`、`system`、`screen`、`theme`、`power`、`shell`、`dialog`、`clipboard`、`storage`、`files` 和 `fetch`。

只声明类别，不声明具体方法。`process.getCpuUsage` 这类值无效，因为权限按 permission category 授权，而不是按单个方法授权。

## 已移除字段

不要使用 `schemaVersion`、`entry`、`initEntry`、`defaultSize`、`sizeLimits`、`capabilities`、`settingsEntry`、`author` 或 `locales.resources`。应用会拒绝这些字段，避免旧包形态静默恢复。
