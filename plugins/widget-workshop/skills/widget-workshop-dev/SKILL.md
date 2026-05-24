---
name: widget-workshop-dev
description: Use when creating or editing Widget Workshop component source folders, manifest.json, index.html, settings files, locale files, preview assets, styling, or runtime component code.
---

# Widget Workshop Dev

## Overview

Use this Skill to build the component package itself. Keep implementation tied to the creator-facing docs and validate the source folder after changing package files.

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
  scripts/settings.default.json
```

Only `manifest.json`, `index.html`, and a preview image are always required. Locale and settings files are required only when declared by the manifest.

## Build Flow

1. Read `docs/*/component-quickstart.md`, `docs/*/manifest-reference.md`, and `docs/*/settings-reference.md`.
2. Create or update `manifest.json` before writing runtime code.
3. Add `index.html` as the fixed entry.
4. Add a package-relative `.png`, `.jpg`, or `.jpeg` preview.
5. Add `locales/<language>.json` only when `manifest.locales.supported` declares that language.
6. Add `scripts/settings.json` only when `hasCustomSettings` is `true`; add defaults when reset behavior matters.
7. Use `widget-workshop-api` for every `window.widgetWorkshop` call and permission decision.
8. Run component validation and re-import the component after package file changes.

## Runtime Code Rules

- Wait for the page to load before reading `window.widgetWorkshop`.
- Read settings with `window.widgetWorkshop.host.getComponentSettings()`.
- Use `app.getLocaleInfo()` for locale decisions.
- Wrap Host API calls in `try`/`catch` and show useful degraded UI when a capability is unavailable.
- Keep all package paths relative and inside the component folder.
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
| Calling gated APIs without UI fallback | Check grants and handle rejected promises |
| Changing docs or contracts for one language only | Keep `docs/en-US` and `docs/zh-CN` mirrored |
