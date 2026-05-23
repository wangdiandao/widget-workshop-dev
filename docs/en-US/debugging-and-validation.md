# Debugging And Validation

Use local validation before publishing or sharing a component. Most failures come from paths, schema mismatches, undeclared permission categories, or assumptions about host grants.

## Import Validation Checklist

- `manifest.json` is valid JSON and contains required fields.
- `index.html` exists at the package root.
- `preview` points to an existing `.png`, `.jpg`, or `.jpeg` file inside the package. SVG previews are not supported.
- `windowSize.width` and `windowSize.height` are positive finite numbers.
- If `dragArea` is declared, its `x`, `y`, `width`, and `height` stay fully inside `windowSize`.
- `windowShape.cornerRadius` fits inside the fixed window size.
- `locales.supported` files exist at `locales/<language>.json`.
- `hasCustomSettings` matches whether `scripts/settings.json` exists.
- `scripts/settings.default.json` values are compatible with `scripts/settings.json`.
- `categories` and `permissions` use accepted category keys.

## Runtime Checklist

- Guard every Host API call with `try`/`catch`.
- Check for `PermissionDenied` before assuming the method or bridge is broken.
- Check for `MethodNotFound` when adding new category or method names.
- Re-import after changing package files.
- Test with the same manifest permission category list that the published component will use.

## Settings Debugging

If settings do not appear, confirm `hasCustomSettings` is `true` and `scripts/settings.json` has `schemaVersion: 1`.

If a reset action is missing, confirm `scripts/settings.default.json` exists, is a JSON object, and every value matches the declared field type and options.

## Host API Debugging

For `fetch.request`, inspect `FetchBlocked`, `FetchTimeout`, and `FetchTooLarge` separately. A blocked URL is a policy problem, not a network retry problem.

For `dialog.showOpenFilePicker(options)` followed by `files.readText(token)`, confirm you pass the returned token string, not a file path.

For `shell.openPackageFile(path)`, confirm the target is package-relative and not an executable or active file type.
