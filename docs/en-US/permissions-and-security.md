# Permissions And Security

Widget Workshop uses permission category declarations plus host grants for gated Host API methods. A component developer should request the narrowest categories that match the component's behavior.

## Declaration And Grant

Declare permission category values in `manifest.json`:

```json
{
  "permissions": ["host", "fetch", "dialog", "files"]
}
```

The manifest declaration says what the component may ask for. The host grant says what the current installation allows. If either side is missing, the method returns `PermissionDenied`.

Some context methods are available without a grant: `app.getLocaleInfo()`, `host.getComponentContext()`, `host.getComponentSettings()`, `host.getRuntimeInfo()`, and `host.getPermissionGrants()`.

## Category Guidelines

- Use `host` for component settings reads, runtime state, permission grants, and display policy.
- Use `fetch` for public HTTPS data requests.
- Use `dialog` and `files` together for user-selected file access.
- Use `storage` for component-private key-value data.
- Use `clipboard` only when the component clearly reads or writes clipboard data.
- Use `shell` only for external links, package files, or saved configured file settings.
- Use `process`, `system`, `screen`, `theme`, and `power` for environment-aware components such as dashboards or device monitors.

## fetch Boundaries

`fetch.request` blocks non-HTTPS, localhost, private, local, and reserved network targets. It also blocks controlled headers and oversized responses. Treat it as a public data API, not as a local network scanner.

## File Boundaries

File reads and writes require a token returned by `dialog.showOpenFilePicker(options)` or `dialog.showSaveFilePicker(options)`. Do not store tokens as durable settings; tokens are session-scoped, and token metadata does not expose absolute paths.

`files.readText(token)` and related methods fail when the token is unknown, released, or belongs to another component.

## Shell Boundaries

`shell.openPackageFile(path)` and `shell.showPackageItemInFolder(path)` accept package-relative paths. They are not arbitrary local path launch APIs.

`shell.launchConfiguredFile(path)` and `shell.getConfiguredFileIcon(path)` accept only paths that were saved in this component's `file` settings. These settings-scoped methods still require the component to declare the `shell` permission category.

Component pages cannot write component settings through Host API. Use `storage.*` for component-private mutable data.
