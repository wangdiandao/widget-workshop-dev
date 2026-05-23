# settings Reference

Generated component settings are defined by `scripts/settings.json`. Default values may be stored in `scripts/settings.default.json`.

## File Location

- `scripts/settings.json`: schema for the generated settings page.
- `scripts/settings.default.json`: optional default-value object used by the reset action.

The app reads `scripts/settings.json` only when `hasCustomSettings` is `true` in `manifest.json`.

## Schema Shape

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

Each field needs `key`, `label`, `type`, `control`, and `default`.

## Supported Controls

- `string`: `text`, `textarea`, `select`, `segmented`
- `number`: `number`, `slider`
- `boolean`: `toggle`, `checkbox`
- `color`: `color`
- `file`: `file`

`select` and `segmented` require `options`. Number fields may provide `min`, `max`, and `step`. File fields may provide `extensions`.

## Options

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

The field default must match one option value.

## Default Values

`scripts/settings.default.json` must be a JSON object compatible with the schema:

```json
{
  "accent": "#3B82F6",
  "mode": "compact"
}
```

If a saved value is missing or invalid, Widget Workshop falls back to the schema default for that field.

## File Fields

A `file` setting stores a path selected from the settings page. This is only a saved setting value. For user-selected file reads and writes inside component code, use the Host API token flow:

```js
const picked = await window.widgetWorkshop.dialog.showOpenFilePicker(options);
const text = await window.widgetWorkshop.files.readText(token);
```

Use `shell.launchConfiguredFile(path)` and `shell.getConfiguredFileIcon(path)` only for paths saved by this component's `file` settings.
