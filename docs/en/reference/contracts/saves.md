# Installation-shared saves

All instances of the same installation automatically share save slots. There is no host leader/follower role or author-selected installation scope. Configuration and KV remain instance-local.

## Calls

| Method | Parameters and result |
| --- | --- |
| `saves.context` | {} → scope: installation |
| `saves.list` | {} → slots summaries |
| `saves.load` | {slot} → found, current, previous summary, recovered |
| `saves.commit` | {slot,`expectedRevision`,value} → new summary |
| `saves.restore` | {slot,`expectedRevision`} → new summary |

A summary contains slot, opaque UUID revision and `savedAt` Unix milliseconds. Snapshots add value. New slots use `expectedRevision`:null; existing slots require the current successful revision. Mismatch returns `SAVE_CONFLICT`. Validate your business schema before applying JSON. Restore creates a new revision rather than rewinding host state.

Serialized JSON bodies are at most 256 KiB. Current and previous successful snapshots are independent of layout, metadata and package rollback. Read the exact machine budgets in [types](../types.md). Progress is not configuration or a cache.

## Concurrency and uncertainty

The host serializes atomic publication. Authors reload/merge or present a conflict rather than overwrite blindly. A lost commit response requires loading to confirm state; cancellation cannot retract an already published revision. Do not store an unbounded frame log.

Use elapsedSince with a business `maxMs` for offline calculation, handling `clockMovedBack` and capped. Local timestamps are not anti-cheat evidence. onClosing provides one bounded normal-shutdown opportunity per document, with no veto; regular checkpoints remain necessary. See [the game recipe](../../recipes/game.md).

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/saves.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
