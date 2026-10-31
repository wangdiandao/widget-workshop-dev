# Advanced desktop integration

Choose the smallest documented interface and define its failure state. Advanced use does not mean arbitrary system access. Exact signatures and quotas are in [desktop extensions](../reference/contracts/desktop-extensions.md), [system integration](../reference/contracts/system-integration.md) and [SDK types](../reference/types.md).

| Solution | Integration | Required boundary |
| --- | --- | --- |
| Card with detail panel | panels.open/post/close with a package-local page | Shared instance identity/grants/saves; separate document lifetime and validated messages |
| Account-backed tool | Component/provider login plus credentials or user secret binding | No host account service; handle expiry/logout without logging secrets |
| Music remote | media.get, supported controls, media.control/artwork | Current/recent session only; tolerate absent session/artwork and changed controls |
| Audio visualization | audio.capture.open/read/close | Default output mix, no microphone; bounded pull buffers and dropped-frame handling |
| Screen preview or color tool | Authorized screen capture through system picker | Cancellation and hidden/locked/navigation/revocation invalidation |
| File preview | files.image / directory.image | Temporary handle/binding scope; placeholder when unavailable |
| Reminders | notifications or reminders methods | Denial, expiry and no delivery while host is not running |
| Widget actions/menus | shortcuts.setActions, contextMenu.setItems | Bounded plain labels; re-register after reload; events are not physical gestures |

## Views and context

ready context.view distinguishes main and panel documents. Every document owns its requests and subscriptions. Panels do not create new installation identities, grants or save namespaces. Send minimal business state and do not persist panelId.

Use language.changed/i18n for host language and theme.changed for actual host theme. accentColor may be null. textScaleFactor is accessibility text scaling, separate from DPI environment.scale. High contrast and reduced motion need their own handling; accent color is not a readability guarantee.

desktop.pointer, desktop.windows and system.activity expose limited geometry/activity without text, titles, input history or arbitrary window control. audio.output affects the default system output, which differs from host widget mute; explain this scope in the UI.

For every stream, handle, panel and timer specify ownership, quota, cancellation and release. Build unavailable/denied/cancelled states before the success path.
