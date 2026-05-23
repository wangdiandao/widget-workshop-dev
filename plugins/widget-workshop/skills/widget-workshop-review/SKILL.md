---
name: widget-workshop-review
description: "Review Widget Workshop component packages before sharing or Steam Workshop publication. Use for manifest, settings, Host API, permissions, localization, preview asset, security, and graceful-degradation reviews."
---

# Widget Workshop Review

## Review Order

1. Run `scripts/Test-ComponentPackage.ps1` against the component source folder.
2. Read `manifest.json` for package identity, preview, window size, categories, permissions, locales, and `hasCustomSettings`.
3. If `hasCustomSettings` is true, review `scripts/settings.json` and `scripts/settings.default.json` together.
4. Search component code for `window.widgetWorkshop` and compare calls to `contracts/host-api.d.ts`.
5. Check that every requested permission category is necessary for visible component behavior.
6. Check that denied permissions degrade cleanly using `host.getPermissionGrants()` or `try`/`catch`.
7. Confirm preview and Workshop metadata are suitable for public sharing.

## Findings

Lead with bugs or release blockers. Include file paths and the exact contract violated. Do not report preferences as blockers.

## Boundaries

- Do not invent Host API methods or permission categories.
- Do not ask creators to edit installed app-data runtime copies unless the user explicitly asks to repair one.
- Do not require Steam upload to complete a component package review; prepare metadata and point to the app workflow.