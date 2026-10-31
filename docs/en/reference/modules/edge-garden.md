# Edge garden example

The sample supports compact, expanded and vertical layouts, bounded growth, inventory/skills, offline calculation and shared saves. Configuration is per display while installation progress is shared. setSize and region updates retain one current operation and a latest intent. `configEpoch` prevents stale responses replacing newer configuration. Simulation and animation are separate; offline elapsed time and resource growth are capped. Save conflicts require reload/merge and package rollback does not roll back progress.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/edge-garden.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.
