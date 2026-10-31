# Configuration and data ownership

Choose ownership before persistence. Appearance can differ per display while progress is shared across the installation.

| Data | Interface | Ownership |
| --- | --- | --- |
| Color, layout mode, refresh period | config.get/set | Per instance; layouts can save/restore configuration |
| Small display-local state | storage.get/set/remove | Instance KV; does not roll back with layouts |
| Game progress or tool documents | saves.load/commit | All installation instances share slots; revision CAS |
| Re-downloadable binary content | cache.* | Reclaimable instance cache; misses are normal |
| Latest business hints | collaboration.* | Temporary installation value; no durable history |
| Access tokens | credentials.* or user-bound secrets | Never shared in packages, layouts, configuration or logs |

## Configuration fields

manifest.configuration is an array of fields, not an arbitrary settings object. An integer refreshSeconds field can declare label, default: 60, minimum: 15, maximum: 3600 and shareable: true. Read ready.configuration or config.get and subscribe to config.changed. Cancel old timers before rescheduling. See [configuration rules](../reference/contracts/configuration.md).

## Revision-based saves

Load a slot with saves.load. Validate current.value before using it. Commit with slot, expectedRevision set to current.revision (or null for a new slot), and a versioned JSON value. Only a successful response advances your local revision.

SAVE_CONFLICT requires reloading and a business merge or explicit conflict UI. Do not overwrite using the latest revision blindly or retry forever. A lost response requires a load before another write. Cancellation does not undo a published commit.

KV allows 256 KiB per value and 16 MiB per instance. Saves have separate budgets and keep the previous successful revision. Save at checkpoints and coalesce updates rather than writing every frame. Neither layouts nor package rollback restore persistent progress. See [saves](../reference/contracts/saves.md).
