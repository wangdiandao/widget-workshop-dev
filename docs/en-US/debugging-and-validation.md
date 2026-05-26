# Debugging And Validation

Before publishing or sharing a component, run local validation. Most issues come from escaped paths, schema mismatches, undeclared permission categories, missing locale files, or assuming the user has already granted a capability.

## Package Shape Checklist

- `manifest.json` is valid JSON and contains required fields.
- `index.html` exists at the package root.
- `preview` points to an existing `.png`, `.jpg`, or `.jpeg` file inside the package.
- `windowSize.width` and `windowSize.height` are positive.
- If `dragArea` is declared, the rectangle stays fully inside `windowSize`.
- `windowShape.cornerRadius` does not exceed the window size.
- `hasCustomSettings` matches whether `scripts/settings.json` exists.
- `categories` and `permissions` use category keys from the public contracts.

## Localization Checklist

- Missing `locales` or `locales.enable:false` does not require locale files.
- `locales.enable:true` requires `default` and `supported`.
- `supported` must include `default`.
- Every supported language must have `locales/<language>.json`.
- If the component list name should be localized, provide `title` in the locale file.

## settings Checklist

- `scripts/settings.json` has `schemaVersion` set to `1`.
- Every field has `key`, `label`, `type`, `control`, and `default`.
- `select` and `segmented` fields provide `options`.
- `default` matches the field type and option value.
- `hasCustomSettings:false` should not have `scripts/settings.json`.

## Runtime Checklist

- Guard every Host API call with `try`/`catch`.
- For `PermissionDenied`, check manifest declaration and user grant first.
- For `MethodNotFound`, check that the category and method come from `contracts/host-api.d.ts`.
- Re-import after package file changes.
- Test with the same permission categories and settings values planned for release.

## Validation Commands

Validate one component package:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path <component-source>
```

Validate this repository:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Plugin.ps1 -PluginPath .\plugins\widget-workshop
git diff --check
```

When Host API, permission categories, or component category contracts change and the local Widget Workshop host repo is available, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```
