# Runtime, windows and input

Enabled intent, visibility and global pause are separate. Hidden widgets continue running; disabled instances release resources; disconnect retains intent and reconnect does not steal focus. Opaque is default. Transparent regions start empty, use local DIP rectangles/polygons and replace atomically. Trusted editing provides a recovery overlay and may reject author updates. beginDrag needs real native input; normalized pointercancel is untrusted. Autonomous movement is user-controlled, off by default, and limited to the current work area. Handle DPI and physical device tests separately.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/runtime.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration. Do not interpret this source summary as a claim that all runtime/device paths were retested.
