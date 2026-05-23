# Contributing

Thank you for improving Widget Workshop Dev.

## Branches

Open feature PRs against `staging`. Promotion PRs from `staging` to `main` are reserved for releases and must update `CHANGELOG.md` plus all plugin and marketplace versions.

## Local Validation

Before opening a PR, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
git diff --check
```

If you changed Host API contracts and have the Widget Workshop host checkout locally, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```

## Change Boundaries

- Keep component developer docs mirrored between `docs/en-US` and `docs/zh-CN`.
- Keep Skills concise; put stable contracts in `contracts/` or `schemas/` instead of duplicating long tables.
- Do not add Widget Workshop app source, Steam SDK files, build output, or runtime app-data copies.
- Update validation scripts when public contracts change.