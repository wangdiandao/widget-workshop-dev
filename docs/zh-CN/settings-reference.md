# settings 参考

生成式组件设置页由 `scripts/settings.json` 定义。只有 `manifest.json` 中 `hasCustomSettings` 为 `true` 时，Widget Workshop 才读取该文件。

## 文件位置

```text
scripts/
  settings.json
```

每个字段必须声明 `default`。重置操作使用字段级默认值，不再依赖单独的 `settings.default.json`。

## Schema 形状

```json
{
  "schemaVersion": 1,
  "fields": [
    {
      "key": "accent",
      "label": { "zh-CN": "强调色", "en-US": "Accent color" },
      "type": "color",
      "control": "color",
      "default": "#3B82F6"
    }
  ]
}
```

每个字段都需要 `key`、`label`、`type`、`control` 和 `default`。

## 字段规则

- `key` 是稳定的内部键名，不要本地化。
- `label` 是语言到文本的对象，至少提供一种语言。
- `default` 必须与字段类型、控件和选项匹配。
- `select` 和 `segmented` 必须提供 `options`。
- 数字字段可提供 `min`、`max`、`step`。
- 文件字段可提供 `extensions`，例如 `[".txt", ".json"]`。

## 支持的控件

| type | control |
|---|---|
| `string` | `text`、`textarea`、`select`、`segmented` |
| `number` | `number`、`slider` |
| `boolean` | `toggle`、`checkbox` |
| `color` | `color` |
| `file` | `file` |

## 选项字段

```json
{
  "key": "mode",
  "label": { "zh-CN": "模式", "en-US": "Mode" },
  "type": "string",
  "control": "segmented",
  "default": "compact",
  "options": [
    { "value": "compact", "label": { "zh-CN": "紧凑", "en-US": "Compact" } },
    { "value": "full", "label": { "zh-CN": "完整", "en-US": "Full" } }
  ]
}
```

默认值必须等于某个 option 的 `value`。

## 组件读取设置

组件运行时通过 Host API 读取用户保存后的设置：

```js
const settings = await window.widgetWorkshop.host.getComponentSettings();
```

组件页面不能通过 Host API 写入 settings。运行时私有可变数据应使用 `storage.*`。

## file 设置

`file` 设置保存用户在设置页选择的绝对文件路径。它只用于已配置文件场景，例如启动已保存路径或读取图标：

```js
await window.widgetWorkshop.shell.launchConfiguredFile(settings.launchTarget);
```

组件代码中若要读取或写入用户选择的文件，应使用 `dialog` 加 `files` 的 token 流程，而不是直接使用 file setting 的路径。
