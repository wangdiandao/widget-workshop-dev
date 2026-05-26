# Quickstart

## Enable The Developer Entry

1. Open developer mode in Widget Workshop settings.
2. The development page appears in the sidebar.
3. Create a component from the development page, then enter its name, size, preview, permissions, and other attributes.
4. Open the source folder from the project card and edit the component files.
5. Re-import after package file changes, then enable and test the component from the component list.

The create-component flow can enable or disable multilingual text. When it is off, the component does not read `locales/*.json`; the component name uses `displayName`, and visible text lives directly in `index.html`. When it is on, the template creates one `locales/<language>.json` starter file for the current default language, and you can extend `supported` later.

## Minimal Component Folder

```text
minimal-clock/
  manifest.json
  index.html
  preview.png
```

If the component has a settings page, add `scripts/settings.json`. If localization is enabled, add `locales/<language>.json`.

## Minimal manifest

```json
{
  "packageId": "com.example.minimal-clock",
  "displayName": "Minimal Clock",
  "version": "1.0.0",
  "description": "A simple desktop clock.",
  "preview": "preview.png",
  "windowSize": { "width": 320, "height": 180 },
  "hasCustomSettings": false,
  "categories": ["desktop_personalization"],
  "permissions": ["host"],
  "locales": { "enable": false }
}
```

`packageId` is the component's unique ID. Prefer a lowercase reverse-DNS style string. `index.html` is the fixed entry; do not add an `entry` field to the manifest. Workshop author attribution comes from the uploading Steam account, so do not add an `author` field.

## Write The Entry Page

Component pages run in WebView2. After the page loads, read context, settings, and grants through `window.widgetWorkshop`:

```html
<script>
async function start() {
  const api = window.widgetWorkshop;
  const [context, settings, grants] = await Promise.all([
    api.host.getComponentContext(),
    api.host.getComponentSettings(),
    api.host.getPermissionGrants()
  ]);

  document.body.textContent = `${context.displayName} ready`;
  document.body.dataset.canFetch = grants.fetch === true ? "true" : "false";
}

start().catch(error => {
  document.body.textContent = error?.message || "Widget Workshop component error";
});
</script>
```

Every Host API method returns a Promise. Protected calls may fail with `PermissionDenied`; unknown categories or methods return `MethodNotFound`. Show an understandable degraded state instead of leaving the component blank.

## Drag Area

When `dragArea` is missing, the whole unlocked window can start a drag. Desktop pet or transparent decorative components usually need only part of the visible surface to drag:

```json
"dragArea": { "x": 48, "y": 96, "width": 128, "height": 132 }
```

The drag area must stay fully inside `windowSize`. Do not put the drag area outside the visible display region.

## Local Validation

Use the example package validation command in this repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path .\examples\minimal-clock
```

For your own component, point `-Path` at the component source folder. After validation, import it in Widget Workshop and test the real runtime behavior.
