# Widget Workshop Dev Agent Instructions

This repository contains the standalone Widget Workshop developer plugin, skills, contracts, examples, and component developer documentation.

Start from these sources before changing behavior:

- `README.md` for install, repository layout, validation, and release flow.
- `docs/en-US` and `docs/zh-CN` for the mirrored component developer contract.
- `contracts/host-api.d.ts`, `contracts/permission-categories.json`, and `contracts/component-categories.json` for the public Host API and manifest categories.
- `schemas/manifest.schema.json` and `schemas/settings.schema.json` for package validation shape.
- `scripts/Test-Repository.ps1`, `scripts/Test-Plugin.ps1`, and `scripts/Test-ComponentPackage.ps1` for local verification.

Keep docs, skills, schemas, and contracts in sync in the same change. Do not add Widget Workshop host source, Steam SDK files, app build output, or runtime app-data copies to this repository.