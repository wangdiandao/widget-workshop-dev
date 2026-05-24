---
name: widget-workshop-workflow
description: Use when routing Widget Workshop component creation, API, validation, troubleshooting, review, publishing-prep, or plugin maintenance tasks.
---

# Widget Workshop Workflow

## Overview

Use this Skill as the entry point for Widget Workshop component work. It chooses the focused Skill, anchors work to the standalone repository contracts, and keeps docs, schemas, validation, and Skills aligned.

## Start Here

Read `README.md` for repository layout and validation commands. For component-facing behavior, read the mirrored docs in `docs/en-US` and `docs/zh-CN` before changing public guidance.

Use these contract sources:

- `contracts/host-api.d.ts` for `window.widgetWorkshop`.
- `contracts/permission-categories.json` for permission categories.
- `contracts/component-categories.json` for manifest category tags.
- `schemas/manifest.schema.json` and `schemas/settings.schema.json` for package validation shape.

## Skill Routing

| Task | Use |
|---|---|
| Create or edit component files | `widget-workshop-dev` |
| Check Host API, permissions, manifest, categories, or settings contracts | `widget-workshop-api` |
| Review a component package before local sharing or Steam Workshop publication | `widget-workshop-code-review` |
| Diagnose import/runtime failures | Start with `widget-workshop-api`, then validate with the component gate |
| Change this plugin, docs, schemas, or contracts | Keep all affected files in sync and run repository validation |

## Validation

Run the smallest useful gate first, then broaden:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path <component-source>
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Plugin.ps1 -PluginPath .\plugins\widget-workshop
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
git diff --check
```

When a local Widget Workshop host checkout is available and Host API contracts changed, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```

## Boundaries

- Treat component source folders as the editable source of truth.
- Do not edit installed app-data runtime copies unless the user explicitly asks to repair a local runtime copy.
- Do not invent Host API methods, manifest fields, permission categories, or component categories.
- Steam Workshop upload is an app workflow; prepare clean metadata and point to `docs/*/workshop-publishing.md`.
