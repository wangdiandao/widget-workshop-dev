# Worker, Canvas and Wasm

Use examples/stardust for decoration and examples/worker-canvas for computation and drawing. Separate one-shot user computation from continuous animation: hiding may stop drawing without cancelling useful calculation.

## Worker ownership and backpressure

Workers have no direct host bridge. The main page calls widgetHost, validates bounded input and sends business data to package-local Worker code. Bundle Wasm and scripts locally. Include task IDs and reject stale results.

Allow one in-flight computation. Continuous drawing may keep one in-flight message and one newest pending value, sending again only after consumption acknowledgement. Limit input/output size, deadlines and frequency. Terminate on error/timeout and wait for explicit retry, without infinite restart loops.

## Lifecycle and fallback

Detect capabilities and actually verify initialization. API existence is not successful execution. Offer Canvas2D, a static frame or an unavailable explanation if OffscreenCanvas/WebGL2/Wasm initialization fails.

Draw one reduced-motion frame, lower energy-saver frequency and pause hidden/locked/suspended drawing. Resume with current state rather than accumulated frames. On pagehide terminate Workers, cancel frames/timers and remove listeners.

Wasm compilation may finish late; cancellation guards later instantiation/DOM updates and does not claim to stop engine compilation. Initialize audio after appropriate user interaction, respect host audio/lifecycle and release nodes/AudioContext when leaving.

Verify backpressure, cancellation, timeout, initialization failures and static fallback. See [stardust](../reference/modules/stardust.md), [development](../reference/modules/development.md) and [audio](../reference/modules/audio.md).
