# Your first widget: a counter

Build a permission-free card to verify installation, enablement, saving and reload. The complete example is examples/counter. It uses instance KV, so each display has its own count.

## Create a runnable directory

Enable developer mode in the host and choose New Component on the Development page. Alternatively copy examples/counter, replace widgetId, and choose Add Component. Select the directory containing manifest.json, index.html, style.css and main.js. The host does not execute author build commands.

A minimal manifest contains schemaVersion: 1, kind: widget, a fresh widgetId UUID, version: "0.0.1", hostApiMajor: 1, nonempty name and author, entry: "index.html", capabilities: [] and configuration: []. See [the full contract](../reference/contracts/component.md). Omitted window defaults to opaque 320×200 DIP on the bottom layer. PowerShell [guid]::NewGuid() generates a new work UUID.

## Wait for the injected SDK

Load the package's main.js using a normal module script. The host provides window.widgetHost before business scripts; do not add an SDK script tag or bundle widget-host.js, widget-host.d.ts or protocol.json. An ordinary browser can preview appearance but cannot verify host integration.

Register pagehide cleanup before waiting for widgetHost.ready. Then call storage.get with key "count" and an AbortSignal. Validate a loaded value as a nonnegative safe integer before rendering. The complete example serializes writes, updates the displayed count only after storage.set succeeds, and removes its click handler when leaving.

## Check and run

Use Check Component Package on the Development page, add the directory as a development component, and enable it on the target display. Installation does not enable it automatically. Open the ready instance's developer tools from the Development page.

Save edits and allow at least one second of stable files for automatic reload, or use Reload manually. Verify persistence after reload, rapid-click serialization and no stale DOM updates after disablement. Record physical-input and multi-monitor cases separately. Continue with [packages](package.md) and [data ownership](data.md).
