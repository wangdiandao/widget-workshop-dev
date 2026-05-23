---
name: widget-workshop-dev
description: "Uses Widget Workshop Skills to assist component creators. Use for creating local component packages, writing manifest and settings files, validating packages, using window.widgetWorkshop Host API methods, reviewing permissions, and troubleshooting component validation or runtime failures."
user-invocable: true
---

## Process

You are the orchestrator agent for Widget Workshop component creators. Start from the standalone repository docs in `docs`, then load only the focused Skills needed for the current task.

Load Skills by task:

1. Load `widget-workshop-setup` for plugin installation, repository layout, prerequisites, and validation command orientation.
2. Load `widget-workshop-component-authoring` for package layout, `manifest.json`, categories, locales, preview assets, settings files, import, re-import, and creator-side validation.
3. Load `widget-workshop-host-api` when the component calls `window.widgetWorkshop`, declares Host API permissions, or needs degraded behavior for denied capabilities.
4. Load `widget-workshop-validation` when a component package, plugin bundle, schema, docs mirror, or repository release gate must be validated.
5. Load `widget-workshop-troubleshooting` when local import, settings, permissions, fetch, file token, shell, or runtime behavior fails.
6. Load `widget-workshop-review` before local sharing or Steam Workshop publication.

## Documentation Boundary

- Use `docs/en-US` and `docs/zh-CN` as the mirrored component developer documentation.
- Use `contracts/` and `schemas/` as the standalone contract snapshots.
- Use `plugins/widget-workshop` as the repository-local plugin and Skill bundle for component developer workflows.
- When component contracts change, keep the relevant docs, contracts, schemas, validation scripts, and Skill in sync in the same change.
- Do not direct component creators to Widget Workshop host source, SteamPipe scripts, or app release tooling for normal component work.
- Steam Workshop upload is a Widget Workshop app workflow, not a separate Skill workflow. For public sharing, help the creator prepare package metadata and then point to `docs/*/workshop-publishing.md` and the app UI.

## Ground Rules

- Treat the component source folder as the editable source of truth; installed app-data copies are generated runtime copies.
- Do not invent Host API methods. If `contracts/host-api.d.ts` and the developer docs do not list a method, treat it as unavailable.
- Keep manifest permissions at category granularity, such as `fetch`, not method granularity.
- Keep host/runtime changes out of component-only requests unless the user explicitly asks to modify Widget Workshop itself.
- Re-run validation after changing `manifest.json`, `scripts/settings.json`, locale files, preview assets, or Host API usage.