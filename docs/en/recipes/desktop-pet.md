# Transparent pets: rendering, hit testing and recovery

Build a character that accepts clicks, dragging and text input while transparent background areas pass input through. Users must still recover it through trusted host editing. Inspect examples/transparent-pet and [runtime rules](../reference/modules/runtime.md).

## Surface and geometry

Declare a transparent surface with inputMode: regions, explicit initial/minimum dimensions and the desired initial layer. Use transparent HTML/CSS backgrounds and replace native hit regions with the actual interactive rectangles or polygons.

Geometry is local DIP inside this instance's content, not screen pixels. Regions start empty after navigation. Measure once ready and update after panel expansion, collapse or size changes. Keep at most one update in flight and one latest pending value. Empty regions mean complete pass-through. Trusted editing owns the overlay and may reject author region changes.

## Input and motion

Do not turn inputs and buttons into drag zones. Use window.beginDrag only for the intended pet gesture. Release dragging on pointercancel/lost capture. Normalized host cancellation is untrusted and cannot prove physical input or a user gesture.

window.moveTo moves only this instance within its display work area. It requires a host preference that defaults off. Rejection must preserve static display and real user dragging. The component cannot grant the preference, move other windows or switch monitors.

Keep names, feeding and progress in installation saves; keep palette and interaction preferences in per-display configuration. Stop wandering during typing, dragging, editing, hidden/locked/suspended states or reduced motion, and reduce work in energy saver.

## Verify

Test pet interiors, transparent exteriors, expanded text input, collapsed regions, drag cancellation and host recovery of a completely pass-through work. Physical mouse, touch/pen and multi-DPI tests are separate from synthesized messages.
