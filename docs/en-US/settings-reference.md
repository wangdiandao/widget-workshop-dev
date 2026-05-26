# settings Reference

Generated component settings pages are defined by `scripts/settings.json`. Widget Workshop reads that file only when `hasCustomSettings` is `true` in `manifest.json`.

## File Location

```text
scripts/
  settings.json
```

Every field must declare `default`. Reset uses field-level defaults and no longer depends on a separate `settings.default.json`.

## Schema Shape

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

Every field needs `key`, `label`, `type`, `control`, and `default`.

## Field Rules

- `key` is a stable internal key and must not be localized.
- `label` is a language-to-text object and must provide at least one language.
- `default` must match the field type, control, and options.
- `select` and `segmented` require `options`.
- Number fields can provide `min`, `max`, and `step`.
- File fields can provide `extensions`, such as `[".txt", ".json"]`.

## Supported Controls

| type | control |
|---|---|
| `string` | `text`, `textarea`, `select`, `segmented` |
| `number` | `number`, `slider` |
| `boolean` | `toggle`, `checkbox` |
| `color` | `color` |
| `file` | `file` |

## Option Fields

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

The default value must equal one option `value`.

## Reading Settings From A Component

Runtime code reads user-saved settings through Host API:

```js
const settings = await window.widgetWorkshop.host.getComponentSettings();
```

Component pages cannot write settings through Host API. Runtime-private mutable data belongs in `storage.*`.

## file Settings

A `file` setting stores an absolute path selected from the settings page. It is for configured-file scenarios such as launching a saved path or reading its icon:

```js
await window.widgetWorkshop.shell.launchConfiguredFile(settings.launchTarget);
```

If component code needs to read or write a user-selected file, use the `dialog` plus `files` token flow instead of directly using the file setting path.
