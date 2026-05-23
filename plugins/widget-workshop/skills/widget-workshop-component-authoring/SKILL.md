---
name: widget-workshop-component-authoring
description: "Widget Workshop component authoring guidance. Use when creating or reviewing component source folders, package files, manifest.json, categories, preview assets, locales, scripts/settings.json, scripts/settings.default.json, import/re-import flow, or creator-side local validation."
---

# Widget Workshop Component Authoring

## Start Here

Read the creator-facing docs that match the user's language:

- `docs/en-US/component-quickstart.md`
- `docs/en-US/manifest-reference.md`
- `docs/en-US/settings-reference.md`
- `docs/zh-CN/component-quickstart.md`
- `docs/zh-CN/manifest-reference.md`
- `docs/zh-CN/settings-reference.md`

Use those docs as the component creator contract.

## Scope

This Skill covers package files and app-side creator workflow:

- component source folder layout
- `manifest.json`
- `index.html` as the fixed entry
- `preview.png`, `preview.jpg`, or `preview.jpeg`
- `locales/<language>.json`
- `scripts/settings.json`
- `scripts/settings.default.json`
- local import, re-import, and visible validation in the Widget Workshop development workspace

It does not cover Widget Workshop host source changes, repository tests, SteamPipe, or app release tooling.

## Authoring Flow

1. Identify the component source folder. Treat it as the editable source of truth.
2. Check `manifest.json`, `index.html`, and the preview asset first.
3. Check manifest `categories` and `permissions` as stable keys, not localized labels.
4. If `locales` is declared, ensure every declared language has a matching locale file.
5. If `hasCustomSettings` is true, ensure `scripts/settings.json` exists and defaults match field types and options.
6. Keep all paths package-relative and inside the component source folder.
7. Import through the Widget Workshop development workspace.
8. Re-import after changing package files.

## Manifest Rules

- Required fields: `packageId`, `displayName`, `version`, `preview`, `windowSize`, and `hasCustomSettings`.
- Recommended for shared components: `description`, `categories`, `permissions`, and `locales`.
- Do not declare `author`; public author attribution comes from the uploader account.
- Use `dragArea` only when a smaller region should start dragging.
- Remove unsupported fields: `schemaVersion`, `entry`, `initEntry`, `defaultSize`, `sizeLimits`, `capabilities`, `settingsEntry`, `author`, and `locales.resources`.

## Settings Rules

- Use `scripts/settings.json` for generated settings.
- Use `scripts/settings.default.json` for optional initial values.
- Keep setting keys stable and unlocalized.
- Read settings at runtime with `window.widgetWorkshop.host.getComponentSettings()`.
- Component JavaScript cannot write host-owned settings.

## Sharing Boundary

For public sharing, help the creator prepare clean package metadata, preview, categories, locales, defaults, and permission declarations. Then point to `docs/*/workshop-publishing.md` and the Widget Workshop app UI. Do not present Steam Workshop upload as a separate Skill workflow.

## Do Not

- Do not ask component creators to inspect Widget Workshop source files for normal package validation.
- Do not direct creators to `dotnet test`, publish scripts, SteamPipe scripts, or repository-local build tools.
- Do not edit installed app-data runtime copies unless the user explicitly asks to repair a local runtime copy.
