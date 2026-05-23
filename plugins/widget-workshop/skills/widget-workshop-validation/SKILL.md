---
name: widget-workshop-validation
description: "Run Widget Workshop Dev validation gates. Use when checking repository health, plugin manifests, Skill frontmatter, Markdown links, JSON contracts, component package structure, example components, or host contract drift."
---

# Widget Workshop Validation

## Repository Gate

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
```

This checks plugin layout, Skill metadata, docs mirror shape, Markdown links, JSON files, contract files, and the minimal example component.

## Component Gate

Run this against the component source folder, not an installed runtime copy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path <component-source>
```

## Host Contract Drift

When a local Widget Workshop host checkout is available:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```

If this fails, update contracts, docs, and Skills from the host source rather than changing the validator to hide drift.