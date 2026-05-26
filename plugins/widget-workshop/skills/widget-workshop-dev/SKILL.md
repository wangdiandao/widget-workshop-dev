---
name: widget-workshop-dev
description: Use when creating or editing Widget Workshop component source folders, manifest.json, index.html, settings files, locale files, preview assets, styling, or runtime component code.
---

# Widget Workshop Dev

## Overview

Use this Skill to build the component package itself. Keep implementation tied to the redesigned creator-facing docs and validate the source folder after changing package files.

## Component Shape

Start from a source folder outside installed app-data runtime copies:

```text
my-component/
  manifest.json
  index.html
  preview.png
  locales/en-US.json
  locales/zh-CN.json
  scripts/settings.json
```

Only `manifest.json`, `index.html`, and a preview image are always required. Locale files are read only when localization is enabled, and settings files are read only when declared by the manifest.

## Build Flow

1. Read `docs/zh-CN/component-quickstart.md`, `docs/zh-CN/manifest-reference.md`, and `docs/zh-CN/settings-reference.md`; use `docs/en-US` as the mirrored English structure.
2. Create or update `manifest.json` before writing runtime code.
3. Add `index.html` as the fixed entry.
4. Add a package-relative `.png`, `.jpg`, or `.jpeg` preview.
5. Add `locales/<language>.json` only when `locales.enable` is `true` or an old manifest declares `locales.default` and `locales.supported` without `enable`; otherwise keep visible text in `index.html`.
6. Add `scripts/settings.json` only when `hasCustomSettings` is `true`; every settings field needs a compatible `default`.
7. Use `widget-workshop-api` for every `window.widgetWorkshop` call and permission decision.
8. Run component validation and re-import the component after package file changes.

## Runtime Code Rules

- Wait for the page to load before reading `window.widgetWorkshop`.
- Read settings with `window.widgetWorkshop.host.getComponentSettings()`.
- Use `app.getLocaleInfo()` for locale decisions.
- Wrap Host API calls in `try`/`catch` and show useful degraded UI when a capability is unavailable.
- Keep all package paths relative and inside the component folder.
- Keep drag regions inside `windowSize`; if `dragArea` is missing, the whole unlocked window can drag.
- Keep visual behavior self-contained in the component; do not require host app changes for normal package work.

## Example Host API Pattern

```html
<script>
async function loadComponent() {
  const api = window.widgetWorkshop;
  try {
    const [context, settings, grants] = await Promise.all([
      api.host.getComponentContext(),
      api.host.getComponentSettings(),
      api.host.getPermissionGrants()
    ]);
    document.body.dataset.packageId = context.packageId;
    document.body.style.setProperty("--accent", settings.accentColor || "#3B82F6");
    document.body.classList.toggle("can-fetch", grants.fetch === true);
  } catch (error) {
    document.body.classList.add("host-api-unavailable");
  }
}
window.addEventListener("DOMContentLoaded", loadComponent);
</script>
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Editing an installed runtime copy | Edit the source folder and re-import |
| Adding unsupported manifest compatibility fields | Follow `schemas/manifest.schema.json` |
| Setting `hasCustomSettings` without `scripts/settings.json` | Add the settings schema or set the flag to `false` |
| Adding locale files without enabling localization | Set `locales.enable: true` or remove the locale files |
| Calling gated APIs without UI fallback | Check grants and handle rejected promises |
| Changing docs or contracts for one language only | Keep `docs/en-US` and `docs/zh-CN` mirrored |
