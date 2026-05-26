# Widget Workshop Component Developer Docs

These docs are for Widget Workshop component developers. They describe how to create, debug, validate, and publish desktop widgets from a local source folder. A component runs in WebView2 as a host-mounted transparent window with an HTML page inside it.

## Reading Path

- [Quickstart](component-quickstart.md): enable developer mode and create the first importable component.
- [manifest Reference](manifest-reference.md): component identity, window, preview, localization, categories, and permission declarations.
- [settings Reference](settings-reference.md): generated settings pages from `scripts/settings.json`.
- [Host API Reference](host-api-reference.md): available `window.widgetWorkshop` APIs, returns, and errors.
- [Permissions And Security](permissions-and-security.md): sensitive capabilities, grant boundaries, file access, and network limits.
- [Debugging And Validation](debugging-and-validation.md): import failures, runtime failures, and local validation scripts.
- [Workshop Publishing](workshop-publishing.md): metadata, licensing, and final checks before public release.

## Component Development Model

The component source folder is the developer-owned source of truth. Widget Workshop validates that folder on import, then creates a controlled runnable copy. Re-import after changing `manifest.json`, `index.html`, the preview image, locale files, or settings files.

```text
my-component/
  manifest.json
  index.html
  preview.png
  locales/
    zh-CN.json
    en-US.json
  scripts/
    settings.json
```

Only `manifest.json`, `index.html`, and a preview image are always required. `locales/*.json` files are read only when localization is enabled. `scripts/settings.json` is read only when `hasCustomSettings` is `true`.

## Current Public Contract

- The entry file is always `index.html`.
- Preview images support `.png`, `.jpg`, and `.jpeg`; SVG is not supported.
- The component name defaults to `displayName`; when localization is enabled, a locale file `title` can override it.
- The settings page is generated from `scripts/settings.json`; each field `default` is its reset value.
- Runtime API calls go only through `window.widgetWorkshop`.
- Permissions are declared by manifest category and granted by the user, not by individual method.
- Component categories come from `contracts/component-categories.json`; missing or empty categories browse as Other.

## AI Plugin And Skills

The repository-local Widget Workshop AI plugin lives at `plugins/widget-workshop`. For AI-assisted component work, start with `widget-workshop-workflow`, then route by task:

- `widget-workshop-dev`: write component folders, manifests, HTML, settings, locales, preview assets, and runtime code.
- `widget-workshop-api`: check Host API calls, permission categories, manifest fields, settings schemas, and runtime errors.
- `widget-workshop-code-review`: review security, graceful degradation, metadata, and package shape before sharing or publishing.

Public Steam Workshop upload is an in-app Widget Workshop workflow, not a separate Skill workflow.
