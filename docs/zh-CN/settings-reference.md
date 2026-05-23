# settings 参考

生成式组件设置由 `scripts/settings.json` 定义。默认值可放在 `scripts/settings.default.json`。

## 文件位置

- `scripts/settings.json`：生成设置页的 schema。
- `scripts/settings.default.json`：可选默认值 object，用于重置操作。

只有 `manifest.json` 中 `hasCustomSettings` 为 `true` 时，应用才读取 `scripts/settings.json`。

## Schema 形状

```json
{
  "schemaVersion": 1,
  "fields": [
    {
      "key": "accent",
      "label": { "en-US": "Accent color", "zh-CN": "强调色" },
      "type": "color",
      "control": "color",
      "default": "#3B82F6"
    }
  ]
}
```

每个字段都需要 `key`、`label`、`type`、`control` 和 `default`。

## 支持的控件

- `string`：`text`、`textarea`、`select`、`segmented`
- `number`：`number`、`slider`
- `boolean`：`toggle`、`checkbox`
- `color`：`color`
- `file`：`file`

`select` 和 `segmented` 必须提供 `options`。数字字段可提供 `min`、`max`、`step`。文件字段可提供 `extensions`。

## 选项

```json
{
  "key": "mode",
  "label": { "en-US": "Mode", "zh-CN": "模式" },
  "type": "string",
  "control": "segmented",
  "default": "compact",
  "options": [
    { "value": "compact", "label": { "en-US": "Compact", "zh-CN": "紧凑" } },
    { "value": "full", "label": { "en-US": "Full", "zh-CN": "完整" } }
  ]
}
```

字段默认值必须匹配某个 option value。

## 默认值

`scripts/settings.default.json` 必须是与 schema 兼容的 JSON object：

```json
{
  "accent": "#3B82F6",
  "mode": "compact"
}
```

已保存值缺失或无效时，Widget Workshop 会回退到该字段的 schema default。

## 文件字段

`file` setting 保存的是用户在设置页选择的路径。这只是设置值。组件代码里要读取或写入用户选择的文件，应使用 Host API token flow：

```js
const picked = await window.widgetWorkshop.dialog.showOpenFilePicker(options);
const text = await window.widgetWorkshop.files.readText(token);
```

`shell.launchConfiguredFile(path)` 与 `shell.getConfiguredFileIcon(path)` 只应传入本组件 `file` settings 保存过的路径。
