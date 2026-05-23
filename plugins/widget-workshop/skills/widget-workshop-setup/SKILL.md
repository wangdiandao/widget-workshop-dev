---
name: widget-workshop-setup
description: "Set up and orient the Widget Workshop Dev plugin repository. Use for installing the plugin, understanding repository layout, checking prerequisites, running validation scripts, or preparing a local development environment for Widget Workshop component work."
---

# Widget Workshop Setup

## Start Here

Read `README.md` for install commands and repository layout. Use `docs/en-US/README.md` or `docs/zh-CN/README.md` for creator-facing documentation.

## Local Validation

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
```

For a single component package:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path .\examples\minimal-clock
```

For plugin structure only:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Plugin.ps1 -PluginPath .\plugins\widget-workshop
```

## Boundaries

- This repository ships developer docs, contracts, schemas, examples, scripts, and the AI plugin.
- It does not contain the Widget Workshop host app source, Steam SDK, build output, or runtime app-data copies.
- When Host API behavior changes in the host app, update `contracts/host-api.d.ts`, `contracts/*.json`, docs, and Skills together.