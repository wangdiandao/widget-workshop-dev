# Your first widget: a counter

Build a permission-free card to verify installation, enablement, saving and reload. The complete example is `examples/counter`. It uses instance KV, so each display has its own count.

## Create a runnable directory

Enable developer mode in the host and choose **New Component** on the **Development** page. Alternatively, copy `examples/counter`, replace `widgetId`, and choose **Add Component**. Select the runnable directory:

```text
counter/
  manifest.json
  index.html
  style.css
  main.js
```

The host does not execute author build commands.

## Declare the component

Create `manifest.json`:

```json
{
  "schemaVersion": 1,
  "kind": "widget",
  "widgetId": "a7253c66-6ea5-46d1-ad99-54e2a036e612",
  "version": "0.0.1",
  "hostApiMajor": 1,
  "name": "Counter",
  "author": "Your Name",
  "entry": "index.html",
  "capabilities": [],
  "configuration": []
}
```

Replace this example UUID with your own. In PowerShell:

```powershell
[guid]::NewGuid()
```

See [the full contract](../reference/contracts/component.md). Omitting `window` gives an opaque 320×200 DIP window on the bottom layer.

## Wait for the injected SDK

Load the package's `main.js` in `index.html`:

```html
<script type="module" src="main.js"></script>
```

The host provides `window.widgetHost` before business scripts. Do not add an SDK script tag or bundle `widget-host.js`, `widget-host.d.ts` or `protocol.json`.

Register `pagehide` cleanup before waiting for `widgetHost.ready`. Then call `storage.get` with key "count" and an `AbortSignal`. Validate a loaded value as a nonnegative safe integer before rendering. The complete example serializes writes, updates the displayed count only after `storage.set` succeeds, and removes its click handler when leaving.

```js
const controller = new AbortController();
let active = true;
window.addEventListener('pagehide', () => {
  active = false;
  controller.abort();
}, {once: true});

await widgetHost.ready;
if (active) {
  const saved = await widgetHost.call('storage.get', {key: 'count'}, {
    signal: controller.signal
  });
  if (active) {
    if (saved.found && (!Number.isSafeInteger(saved.value) || saved.value < 0)) {
      throw new Error('INVALID_SAVED_VALUE');
    }
    document.querySelector('output').textContent = String(saved.found ? saved.value : 0);
  }
}
```

The complete example also handles read/write errors and disables controls while a write is in progress.

## Check and run

Use Check Component Package on the Development page, add the directory as a development component, and enable it on the target display. Installation does not enable it automatically. Open the ready instance's developer tools from the Development page.

Save edits and allow at least one second of stable files for automatic reload, or use Reload manually. Verify persistence after reload, rapid-click serialization and no stale DOM updates after disablement. Record physical-input and multi-monitor cases separately. Continue with [packages](package.md) and [data ownership](data.md).
