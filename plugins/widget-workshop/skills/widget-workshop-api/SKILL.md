---
name: widget-workshop-api
description: Use when working with Widget Workshop Host API calls, permission categories, manifest.json, settings schemas, package categories, validation contracts, or runtime API errors.
---

# Widget Workshop API

## Overview

Use the public contract snapshots instead of memory or host-source guesses. Keep every API call, permission, manifest field, and settings field traceable to `contracts/`, `schemas/`, and mirrored docs.

## Source Order

1. Read `contracts/host-api.d.ts` for `window.widgetWorkshop.<category>.<method>(...)`.
2. Read `contracts/permission-categories.json` before declaring `manifest.permissions`.
3. Read `contracts/component-categories.json` before declaring `manifest.categories`.
4. Read `schemas/manifest.schema.json` and `schemas/settings.schema.json` for accepted file shape.
5. Use `docs/en-US/*` and `docs/zh-CN/*` as creator-facing wording.

## Manifest Rules

- Required fields: `packageId`, `displayName`, `version`, `preview`, `windowSize`, and `hasCustomSettings`.
- Entry is always `index.html`; do not add `entry`.
- Preview must be a package-relative `.png`, `.jpg`, or `.jpeg`.
- `categories` are optional functional browsing tags from `component-categories.json`.
- `permissions` are category keys only. Values like `process.getCpuUsage` are invalid.
- Do not add removed fields: `schemaVersion`, `entry`, `initEntry`, `defaultSize`, `sizeLimits`, `capabilities`, `settingsEntry`, `author`, or `locales.resources`.

## Settings Rules

- Use `scripts/settings.json` only when `manifest.hasCustomSettings` is `true`.
- Use `schemaVersion: 1` and stable, unlocalized setting keys.
- Put optional reset defaults in `scripts/settings.default.json`.
- Component code reads host-owned settings through `window.widgetWorkshop.host.getComponentSettings()`.
- Component code must not write host-owned settings; use `storage.*` for component-private mutable data.

## Host API Rules

- Call only through `window.widgetWorkshop`.
- Treat every method as asynchronous and wrap calls that can fail.
- Use `host.getPermissionGrants()` for optional capability UI and graceful degradation.
- Handle `PermissionDenied`, `MethodNotFound`, `InvalidArguments`, `HostApiError`, and category-specific errors from the docs.
- Use file token flows: `dialog.showOpenFilePicker()` or `dialog.showSaveFilePicker()` before `files.*`, then release tokens when done.
- Use `fetch.request` only for public HTTPS data requests; do not treat it as local network access.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Inventing a method from an old sample | Check `contracts/host-api.d.ts` first |
| Declaring method-level permissions | Declare only category keys |
| Adding `author` to `manifest.json` | Author attribution comes from the uploader account |
| Saving file tokens or absolute paths as API state | Use the settings file field and token flow described in docs |
| Debugging runtime behavior before validation | Run `scripts/Test-ComponentPackage.ps1` first |
