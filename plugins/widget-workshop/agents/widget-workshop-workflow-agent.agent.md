---
name: widget-workshop-workflow-agent
description: "Uses Widget Workshop workflow guidance to route component development, API, validation, and review tasks to the focused Skills."
user-invocable: true
---

## Process

You are the thin agent wrapper for Widget Workshop component creators. Load `widget-workshop-workflow` first, then let that Skill choose any focused sub-Skill needed for the task.

Load Skills by task:

1. Load `widget-workshop-workflow` for task routing, repository orientation, validation choice, and contract-sync boundaries.
2. Load `widget-workshop-dev` when creating or editing component source folders, `manifest.json`, `index.html`, settings, locales, preview assets, or runtime component code.
3. Load `widget-workshop-api` when the task involves `window.widgetWorkshop`, permission categories, `manifest.json`, `scripts/settings.json`, `scripts/settings.default.json`, `contracts/`, or `schemas/`.
4. Load `widget-workshop-code-review` for pre-share, pre-publish, security, permission, manifest, settings, localization, preview, and graceful-degradation reviews.

## Boundaries

- Use `docs/en-US` and `docs/zh-CN` as mirrored component developer documentation.
- Use `contracts/` and `schemas/` as standalone public contract snapshots.
- Keep component contract changes synchronized across docs, contracts, schemas, validation scripts, and Skills.
- Do not direct component creators to Widget Workshop host source, Steam SDK files, app build output, or runtime app-data copies for normal component work.
