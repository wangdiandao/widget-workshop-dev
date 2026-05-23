# Widget Workshop Component Developer Docs

This documentation is written for component developer work. It describes the package files, manifest contract, generated settings schema, Host API permissions, validation flow, and Steam Workshop publishing requirements for Widget Workshop components.

## Package Anatomy

A component source folder is the source of truth. Widget Workshop imports a controlled runnable copy from that folder, so edit the source folder and re-import after changes.

```text
manifest.json
index.html
preview.png
locales/zh-CN.json
locales/en-US.json
scripts/settings.json
scripts/settings.default.json
```

Only `manifest.json`, `index.html`, and a preview file are always required. Locale and settings files are required only when the manifest declares them.

## Reading Path

- Start with [Component Quickstart](component-quickstart.md) to create, validate, import, and test a component.
- Use [manifest Reference](manifest-reference.md), [settings Reference](settings-reference.md), and [Host API Reference](host-api-reference.md) while implementing package behavior.
- Read [Permissions And Security](permissions-and-security.md) before using `fetch`, files, clipboard, shell, system, screen, theme, process, or power APIs.
- Use [Debugging And Validation](debugging-and-validation.md) when local import or runtime behavior fails.
- Use [Workshop Publishing](workshop-publishing.md) before preparing a public Steam Workshop upload.

## AI Plugin And Skills

The repository-local Widget Workshop AI plugin lives at `plugins/widget-workshop`. The `widget-workshop-dev` agent is the Skill orchestrator for component creators; when Codex helps implement or review a component, prefer that agent so it can load these task-focused skills:

- `widget-workshop-setup`: plugin installation, repository layout, prerequisites, and validation command orientation.
- `widget-workshop-component-authoring`: component source folders, `manifest.json`, settings, locales, preview assets, import, and re-import.
- `widget-workshop-host-api`: `window.widgetWorkshop` calls, permission categories, return shapes, and runtime boundaries.
- `widget-workshop-validation`: repository, plugin, docs, contract, and component package validation gates.
- `widget-workshop-troubleshooting`: import, settings, permission, fetch, file token, shell, and runtime failure triage.
- `widget-workshop-review`: pre-publication review for manifest, settings, Host API, permissions, localization, preview, and graceful degradation.

Steam Workshop upload is a Widget Workshop app workflow, not a separate Skill; for public sharing, first prepare component metadata, preview, categories, permissions, and license information with [Workshop Publishing](workshop-publishing.md).

## Current Component Surface

- Entry file: `index.html`.
- Preview formats: `.png`, `.jpg`, `.jpeg`. SVG previews are not supported.
- Settings schema: `scripts/settings.json` with optional `scripts/settings.default.json`.
- Runtime API: `window.widgetWorkshop`.
- Permission model: manifest permission category declaration plus host grant for gated methods.
- Marketplace categories: Dashboard, Productivity, Desktop Personalization, Workflow Integrations, Device Environment, Lifestyle, and Other.

## Document Index

- [Component Quickstart](component-quickstart.md)
- [manifest Reference](manifest-reference.md)
- [settings Reference](settings-reference.md)
- [Host API Reference](host-api-reference.md)
- [Permissions And Security](permissions-and-security.md)
- [Debugging And Validation](debugging-and-validation.md)
- [Workshop Publishing](workshop-publishing.md)
