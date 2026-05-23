# Component Quickstart

## Create A Component Folder

Create a local source folder outside the installed app data area. Keep all component files inside that folder so package-relative paths cannot escape the package boundary.

```text
my-clock/
  manifest.json
  index.html
  preview.png
  locales/
    en-US.json
    zh-CN.json
  scripts/
    settings.json
    settings.default.json
```

The source folder is what a component developer edits. The app copies and validates it during import.

## Minimal Component

Use this shape when the component has no generated settings page and no localized text files:

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
  "permissions": ["host"]
}
```

`index.html` is the fixed entry. Do not add an `entry` field to the manifest.

Do not add an `author` field. Workshop author attribution comes from the Steam uploader identity.

For desktop pet style components, add `dragArea` to the manifest when only part of the visible window should start dragging:

```json
"dragArea": { "x": 48, "y": 96, "width": 128, "height": 132 }
```

If `dragArea` is missing, the whole component window remains draggable while unlocked.

## Implement `index.html`

Load component settings and runtime context through `window.widgetWorkshop` after the page is ready:

```html
<script>
async function start() {
  const context = await window.widgetWorkshop.host.getComponentContext();
  const settings = await window.widgetWorkshop.host.getComponentSettings();
  document.body.textContent = `${context.displayName} ready`;
}

start().catch(error => {
  document.body.textContent = error?.message || "Widget Workshop component error";
});
</script>
```

Always handle rejected Host API promises. Gated calls may fail with `PermissionDenied`, and unknown category or method names return `MethodNotFound`.

## Import And Test

1. Enable developer mode in Widget Workshop.
2. Open the development workspace.
3. Add the component source folder.
4. Validate the manifest, preview, locales, settings schema, and entry file.
5. Import the controlled local copy.
6. Enable the component from the component list.
7. Test the component with the same permission categories and settings values that a published package will use.

Re-import after changing `manifest.json`, `index.html`, `preview.png`, locale files, or settings files.

## Continue Reading

- [manifest Reference](manifest-reference.md)
- [settings Reference](settings-reference.md)
- [Host API Reference](host-api-reference.md)
- [Permissions And Security](permissions-and-security.md)
- [Debugging And Validation](debugging-and-validation.md)
