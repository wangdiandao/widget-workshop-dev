# manifest Reference

`manifest.json` defines the public package contract for a Widget Workshop component. The file must be a JSON object at the package root.

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
    "default": "en-US",
    "supported": ["en-US", "zh-CN"]
  }
}
```

## Required Fields

- `packageId`: stable lowercase identity. Use lowercase letters, digits, dots, and hyphens.
- `displayName`: display name shown in Widget Workshop.
- `version`: component version. Use letters, digits, dots, hyphens, or plus signs.
- `preview`: package-local preview image. Supported extensions are `.png`, `.jpg`, and `.jpeg`; SVG previews are not supported.
- `windowSize`: fixed component window size with positive `width` and `height`.
- `hasCustomSettings`: set to `true` only when `scripts/settings.json` exists.

`description` is recommended for local development and Workshop publishing. Workshop author attribution is resolved from the Steam account that uploads the item, not from `manifest.json`.

## Entry And Package Paths

The entry file is always `index.html`. Manifest paths must stay inside the component package. Do not use absolute paths or `..` segments for preview or other package assets.

## Window Shape

`windowShape` is optional. Supported forms:

```json
{ "kind": "rectangle" }
```

```json
{ "kind": "roundedRectangle", "cornerRadius": 16 }
```

For a rounded rectangle, `cornerRadius` must be finite, non-negative, and no larger than half of the smaller window dimension.

## Drag Area

`dragArea` is optional. When it is missing, the whole `windowSize` surface can start an unlocked drag. When it is declared, only that rectangle starts dragging; content outside it remains visible and moves with the component.

Use component-window logical pixels:

```json
{ "x": 48, "y": 96, "width": 128, "height": 132 }
```

`x` and `y` must be finite numbers greater than or equal to `0`. `width` and `height` must be positive finite numbers. The rectangle must stay fully inside `windowSize`, or manifest validation fails.

## Locale Contract

When `locales` is declared:

- `locales.default` is required.
- `locales.supported` must include the default language.
- Each supported language resolves to `locales/<language>.json`.

Use safe language tags such as `en-US` and `zh-CN`.

## Category Tags

| manifest key | Display tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| missing or empty | Other |

## Permission Categories

Accepted permission category values are `app`, `host`, `process`, `system`, `screen`, `theme`, `power`, `shell`, `dialog`, `clipboard`, `storage`, `files`, and `fetch`.

Declare categories only. Values such as `process.getCpuUsage` are invalid because permissions are granted by permission category, not by individual method.

## Removed Fields

Do not use `schemaVersion`, `entry`, `initEntry`, `defaultSize`, `sizeLimits`, `capabilities`, `settingsEntry`, `author`, or `locales.resources`. The app rejects these fields so older package shapes do not silently return.
