# Lessons from local component development

These implementation patterns cover interaction, asynchronous work, persistence and resource cleanup. Adapt them to your component.

## 1. Configure transparent rendering and input together

The pet submits a character polygon and an input-panel rectangle together. Transparent CSS affects appearance; native regions decide what receives input. A character-only shape makes panel inputs unreachable, while a full-window region blocks the desktop.

Separate visual shape from hit geometry, replace the complete region set after panel changes, and yield to trusted host editing. Source: `examples/transparent-pet/main.js`, regions/configure. Check character interior, empty background, text inputs and host recovery of a fully pass-through work.

## 2. Coalesce intent instead of replaying old states

The pet uses updating/dirty; the garden uses applying/desired. Each keeps one current operation and the newest intent. An unbounded queue of expand/collapse requests lets old setSize completions restore outdated UI.

Consume the latest intent after the current call finishes, without infinite retries. The garden also uses `configEpoch` to prevent stale `config.set` responses from overriding newer `config.changed` events. Source: `examples/edge-garden/main.js`. Rapidly alternate modes and inject a config update between responses; the final valid intent must win.

## 3. Unlock and resume are independent

Lock and suspension can overlap. A single paused boolean may resume drawing after unlocked even while the system remains suspended.

The pet and computation canvas use a set of independent stop reasons: unlocked removes locked; resumed removes suspending. Document visibility, host visibility and `sessionLocked` remain separate checks. Source: transparent-pet/`main.js` and worker-canvas/`main.js`. The sequence locked → suspending → unlocked must stay stopped until resumed.

## 4. Cancelling a read does not retract a modification

The file tool says an unconfirmed save may need checking at the selected location; clipboard cancellation cannot retract an already written value. Abort signals do not roll back external effects.

The reminder tool distinguishes a confirmed edit from its follow-up list refresh. Cancelling the list preserves success feedback; an unconfirmed mutation requires a manual reload. Sources: `examples/file-tool/main.js` and reminders contract. Test cancellation before execution, with a lost response and after successful commit but before list completion.

## 5. Keep a single slot until cleanup finishes

Do not release a mutation slot as soon as the cancel button is pressed. The underlying request may still be finishing, so repeated cancel/start can accumulate work.

Reminder operations retain their slot until the original request ends; compatibility reports have one `reportController`. Sources: reminders contract and worker-canvas/`main.js`. Rapid start/cancel must keep outstanding work bounded. Replaceable reads still need generations and host pending-request limits.

## 6. Worker drawing needs acknowledgements

Stardust gives each state a sequence and sends the next latest state only after the matching applied acknowledgement. The computation canvas uses `presentationInFlight`/`pendingPresentation` and a five-second response deadline. Posting at a fixed interval does not establish backpressure.

Separate computation from presentation. Keep one compute task and a newest pending drawing state. Stop on failure/timeout and offer explicit retry. Sources: stardust/`main.js` and worker-canvas/`main.js`. Slow consumption must not grow an unbounded queue or replay obsolete frames on resume.

## 7. Retrying transferred canvases requires resource reconstruction

After transferring a canvas to a Worker, do not assume the same element can be initialized through the same path again. Explicit canvas cancellation terminates the Worker and replaces the element with a clean canvas for a user retry. `pagehide` only releases resources and does not replace old DOM.

Source: worker-canvas/`main.js`, cancel/stopWorker/`pagehide`. Verify retry after explicit cancellation and no DOM replacement after leaving.

## 8. Do not announce persisted rewards before commit success

The garden separates model, simulation and persistence. Shared saves require revision comparison because every monitor has write eligibility. An author-defined primary-display flag cannot remove conflicts.

Validate data/revisions and save at meaningful checkpoints. Reload/merge `SAVE_CONFLICT`. After an uncertain response, load before assuming cancellation prevented publication. Sources: saves/collaboration contracts and edge-garden game logic. Test concurrent writers, stale revisions, long offline time and clock rollback.

## 9. Initial state and fallback must work independently

A missing cache should still allow a CSS static preview. Worker/GPU failure should not make the component disappear. Reduced motion draws a static frame; energy saver lowers frequency; hidden/locked/suspended state stops drawing. These are distinct policies, not one universal business pause.

Stardust cache stores reconstructible previews and is not proof that GPU recovery succeeded. Sources: stardust module and cache contract. Test empty/corrupt cache, failed Worker initialization and reduced motion without relying on prior successful runs.

## 10. Reload runs a validated copy

Source watching waits at least one second of stable changes before copy/validation. Invalid candidates preserve the last successful version. Unsaved drafts delay automatic activation; manual actions retain save/discard/continue editing. Restoring the previous package disables automatic reload to prevent immediate replacement.

Source: development module. Check the bound build output first when edits do not appear. Do not bypass draft protection or copy host binaries as a reload workaround. Test partial writes, invalid manifests, drafts and missing directories.

## 11. Cleanup includes failure and leaving

File tools remove handlers, abort work and clear previews on `pagehide`. The computation canvas also closes audio and terminates Workers. Releasing handles only on success leaks failure paths; guarding only successful callbacks leaves stale errors able to modify old UI.

Sources: file-tool/`main.js` and worker-canvas/`main.js`. Give each handle, subscription, timer and object URL an owner, release in finally where appropriate, and make document invalidation irreversible. Verify success, denial, cancellation, timeout and closure separately.

Use the [recipes](../recipes/index.md) to choose source material, then select the relevant failure cases above.
