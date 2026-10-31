# System integration

The host exposes limited native facts and scoped operations, not unrestricted Windows APIs.

`screen.capture` requires authorization and a trusted system picker. open/read/close manage a short bounded document-owned session and image frames. Cancellation, hidden/pause/lock/suspend/navigation or revocation invalidate work. Do not persist capture IDs or promise background capture.

`desktop.pointer.get` returns a position within the instance's display or null; `desktop.windows.get` returns bounded window geometry and foreground flags, without titles/content/control. `system.activity.get` reports active/idle/unknown without input text or history.

`audio.output.get/set` reads or changes the default output device's volume/mute, distinct from the host's widget mute. It is a base interface. Make its system-wide effect clear in UI.

`files.image` and `directory.image` return scoped icons/thumbnails; missing imagery needs a fallback. `media.get/control/artwork` operate on the current/recently read session and supported controls, not arbitrary apps.

clipboard capability covers text, PNG, HTML and file import. Use read/write methods for each supported format; no history or listener exists. Browser clipboard APIs cannot bypass this authorization. Imported files are bounded temporary read-only handles. Treat clipboard HTML as untrusted data, not executable UI.

Read the [types](../types.md) for exact parameters and image shapes; implement denial, unavailable, cancelled and expired states before success. Device availability and OS picker behavior require actual environment testing.

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
