# Permissions And Security

Widget Workshop controls sensitive Host API access through manifest permission declarations and user grants. A component should request only the smallest permission categories its behavior really needs.

## Declaration And Grant

Declare permission categories in `manifest.json`:

```json
{
  "permissions": ["host", "fetch", "dialog", "files"]
}
```

The manifest declaration says what the component may use. The user grant says what the current installation allows. If either side is missing, protected methods return `PermissionDenied`.

Some context methods do not require a user grant: `app.getLocaleInfo()`, `host.getComponentContext()`, `host.getComponentSettings()`, `host.getRuntimeInfo()`, and `host.getPermissionGrants()`.

## Category Selection

- `host`: read component settings, runtime state, grant state, and display policy.
- `fetch`: request public HTTPS data.
- `dialog` + `files`: access files selected by the user.
- `storage`: save component-private key-value data.
- `clipboard`: use only when the component clearly reads or writes clipboard data.
- `shell`: open external links, passive package files, or saved file settings.
- `process`, `system`, `screen`, `theme`, `power`: use for dashboards, device state, and environment-aware components.

## Network Boundaries

`fetch.request` is for public HTTPS data. It blocks non-HTTPS, localhost, private, local, and reserved network targets. It also limits controlled headers, redirects, timeout, and response body size. Do not design it as local network scanning or intranet access.

## File Boundaries

File reads and writes must first receive a token from `dialog.showOpenFilePicker(options)` or `dialog.showSaveFilePicker(options)`, then pass that token to `files.*`.

Do not store tokens as durable settings. Tokens are session-scoped grants, metadata does not expose absolute paths, and released tokens cannot be reused.

## shell Boundaries

`shell.openPackageFile(path)` and `shell.showPackageItemInFolder(path)` accept only package-relative paths. `openPackageFile` blocks executables and active script file types.

`shell.launchConfiguredFile(path)` and `shell.getConfiguredFileIcon(path)` accept only paths saved by this component's `file` settings, and the manifest still must declare the `shell` category.

Component pages cannot write component settings through Host API. Use `storage.*` for runtime mutable data.
