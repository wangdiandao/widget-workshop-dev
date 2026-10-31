# Runtime, windows and input

Enabled intent, visibility and global pause are separate. Hidden widgets continue running; disabled instances release resources; disconnect retains intent and reconnect does not steal focus. Opaque is default. Transparent regions start empty, use local DIP rectangles/polygons and replace atomically. Trusted editing provides a recovery overlay and may reject author updates. beginDrag needs real native input; normalized `pointercancel` is untrusted. Autonomous movement is available by default without a permission switch and is limited to the current work area. Hidden, editing, dragging, paused, locked and suspended states block it. Accepted positions are coalesced and do not change the saved layout anchor. Handle DPI and physical device tests separately.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/runtime.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.
