# Stardust decoration

The sample is a pass-through decorative particle renderer with bounded state messages. It sends a sequence-tagged state and waits for matching applied acknowledgement, keeping only the latest pending state. Hidden/locked/suspended states stop drawing, reduced motion produces a static frame and energy saver lowers frequency. Worker/GPU initialization failure leaves a CSS/static fallback. Cached previews are reconstructible, palette-specific and not written every frame; a cache hit is not proof of GPU recovery.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/stardust.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration. Do not interpret this source summary as a claim that all runtime/device paths were retested.
