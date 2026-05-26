# manifest Reference

`manifest.json` is the public package contract for a component. It must live at the component root and must be a JSON object.

## Example

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

## Required Fields

| Field | Description |
|---|---|
| `packageId` | Unique component ID. Use lowercase letters, digits, dots, and hyphens. |
| `displayName` | Default component name. When localization is off, the component list shows this value. |
| `version` | Component version. Letters, digits, dots, hyphens, and plus signs are supported. |
| `preview` | Package-local preview image path. Supports `.png`, `.jpg`, and `.jpeg`. |
| `windowSize` | Fixed window size; `width` and `height` must be positive. |
| `hasCustomSettings` | Set to `true` only when `scripts/settings.json` exists. |

`description` should be a short useful summary. It can seed Workshop copy, but public release copy should still be reviewed on the publishing page.

## Package Paths And Entry

The entry file is always `index.html`. Manifest paths must be package-relative. Do not use absolute paths, backslash paths, or `..` path segments.

The preview image should be square or nearly square and readable in the component list and Workshop browse page.

## Window Shape

`windowShape` is optional:

```json
{ "kind": "rectangle" }
```

```json
{ "kind": "roundedRectangle", "cornerRadius": 16 }
```

The corner radius should be non-negative and no larger than half of the shorter window dimension.

## Drag Area

`dragArea` is optional. When it is missing, the whole `windowSize` surface can start a drag. When it is declared, only that rectangle starts a drag. Coordinates use component-window logical pixels.

```json
{ "x": 48, "y": 96, "width": 128, "height": 132 }
```

`x` and `y` must be greater than or equal to 0. `width` and `height` must be greater than 0. The rectangle must stay fully inside `windowSize`.

## Localization

When localization is not enabled, omit `locales` or write:

```json
"locales": { "enable": false }
```

Widget Workshop then does not read `locales/*.json`; the component name comes from `displayName`, and visible text should live directly in `index.html`.

When localization is enabled:

- `locales.enable` is `true`.
- `locales.default` is required.
- `locales.supported` must include the default language.
- Every supported language must have `locales/<language>.json`.

Compatibility rule: if `locales` declares `default` and `supported` without `enable`, it is treated as enabled.

A locale file can use `title` to override the component management display name. Missing `title` falls back to `displayName`.

## Categories

| manifest key | Browse tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| missing or empty | Other |

## Permissions

`permissions` accepts only permission categories: `app`, `host`, `process`, `system`, `screen`, `theme`, `power`, `shell`, `dialog`, `clipboard`, `storage`, `files`, and `fetch`.

Do not declare individual methods such as `process.getCpuUsage`. Permissions are declared and granted by category.

## Removed Fields

Do not use `schemaVersion`, `entry`, `initEntry`, `defaultSize`, `sizeLimits`, `capabilities`, `settingsEntry`, `author`, or `locales.resources`. These fields are treated as old package shapes and rejected.
