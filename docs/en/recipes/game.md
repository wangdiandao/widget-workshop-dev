# Edge games: progress, offline simulation and saves

Start with examples/edge-garden: game.js owns the model, simulation.js computation, main.js host/view coordination and audio.js audio resources. Keep these responsibilities separate.

## Versioned progress and conflicts

Define bounded JSON progress including a business schema version, resources, inventory, growth and last successful timestamp. Validate loaded values. An unsupported schema needs explicit recovery rather than guesses or silent overwrite. Display mode belongs to per-display configuration; progress belongs to shared installation saves.

Commit with the current successful expectedRevision, or null for a new slot. Advance the local revision only after success. SAVE_CONFLICT requires reload and a business merge or user choice. Last-writer-wins is not valid for concurrent rewards or spending. Package/layout rollback does not roll back saves.

## Bounded offline progress

Use widgetHost.elapsedSince(savedAt, {maxMs: 8 * 60 * 60 * 1000}) with a validated timestamp. Eight hours is an example business cap, not a platform limit. Handle clockMovedBack and capped explicitly. Use aggregate computation or bounded simulation steps and cap resource growth. Local time is not an anti-cheat authority.

## Rendering and checkpoints

Animation draws current state and does not save every frame. Pause hidden drawing, render a static reduced-motion frame and lower frequency for energy saver. Resume by calculating bounded elapsed time rather than replaying every missed frame.

Allow one in-flight save and a coalesced pending state per slot. Regular checkpoints remain necessary: onClosing offers one bounded opportunity, cannot veto shutdown and is not the only persistence path. A lost response needs a load; cancellation cannot retract a published snapshot.

Test empty, corrupt and unsupported saves, repeated input, uncertain commits, concurrent monitors, clock rollback, long offline time and closing. See [saves](../reference/contracts/saves.md) and [edge-garden behavior](../reference/modules/edge-garden.md).
