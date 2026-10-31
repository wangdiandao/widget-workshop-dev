# Lifecycle and debugging

widgetHost.ready is the shared handshake Promise. Register pagehide invalidation before asynchronous initialization. Each task needs its own AbortController and a generation check; guard late failures as well as successes. call accepts {signal}; on returns an unsubscribe function.

## One current task

When refreshing, increment a generation, abort the previous controller and start one new request. Render only if the document remains active and its generation is current. In finally, clear only that controller's task slot. On pagehide, invalidate the generation, abort, clear timers and unsubscribe. See examples/information-feed for a complete implementation.

Schedule the next periodic request after the current one finishes. Bound bytes, messages, concurrency, deadlines and retries. Close WebSockets when leaving and bound incoming/outgoing queues. Cancellation does not undo committed side effects.

## Visibility is separate from enablement

Hidden widgets continue running unless authors reduce their own work. Disabled widgets release runtime resources; disconnected displays retain enabled intent. Global pause attempts suspension; resume should draw the latest state rather than replay accumulated frames.

Use visibility.changed, system.changed and lifecycle.changed to coordinate work. Handle reduced motion, energy saver, session lock and editing independently. Stop drawing while hidden/locked/suspended, draw a static frame for reduced motion, and reduce frequency on battery-saving policy.

Handle pointercancel and lost capture. Host-normalized cancellation is untrusted and is not proof of physical input or a user gesture.

## Diagnose at the correct layer

| Symptom | Check |
| --- | --- |
| No widgetHost in a browser | Run in the actual host; browser preview only verifies appearance |
| Duplicate identity | Another source already installed widgetId; new works need new UUIDs |
| Edits do not appear | Bound output directory, reload switch, invalid package or unsaved draft |
| CAPABILITY_UNDECLARED / DENIED | Manifest declaration and installation grant |
| SAVE_CONFLICT | Another writer committed; reload and merge |
| RESOURCE_UNAVAILABLE | Expired document/handle/binding or unavailable system capability |
| METHOD_NOT_FOUND | Current features and SDK baseline |

Use Check Component Package before debugging runtime code. Open developer tools for an enabled, ready instance from Development. compatibility() separates host features, browser API existence, actual probes and untested devices; existence does not establish actual audio, Worker, gamepad or physical input support.

Read [runtime](../reference/modules/runtime.md) and [API behavior](../reference/contracts/host-api.md).
