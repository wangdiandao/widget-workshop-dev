---
name: widget-workshop-troubleshooting
description: "Troubleshoot Widget Workshop component creator issues. Use when local import, manifest validation, settings schema validation, preview loading, locale loading, permission grants, fetch requests, dialog/files token flow, shell calls, or runtime Host API behavior fails."
---

# Widget Workshop Troubleshooting

## Start Here

Read `docs/en-US/debugging-and-validation.md` or `docs/zh-CN/debugging-and-validation.md` first.

## Triage Order

1. Confirm the component source folder is the one being edited.
2. Validate `manifest.json` before debugging runtime behavior.
3. Check package-relative paths for `index.html`, preview, locales, and settings files.
4. Check `hasCustomSettings` against `scripts/settings.json`.
5. Check settings defaults against the declared field types and options.
6. Check manifest permission category declarations before inspecting permission grants.
7. Re-import the component after file changes.

## Host API Failures

- `PermissionDenied`: inspect manifest declaration and grant state.
- `MethodNotFound`: inspect category and method spelling against developer docs.
- `InvalidArguments`: inspect argument shape and type.
- `FetchBlocked`: inspect URL scheme, address class, headers, redirect target, and response size.
- `NotFound`: inspect package-relative paths or file token lifetime.

## Boundary

- Do not ask component creators to run repository source scripts, `dotnet test`, SteamPipe scripts, or app publish commands.
- Use Widget Workshop's development workspace and the visible validation/runtime error as the creator troubleshooting surface.
- When reporting a fix, identify the failing file, the failed creator-facing contract, and the smallest package change that restores the component.
