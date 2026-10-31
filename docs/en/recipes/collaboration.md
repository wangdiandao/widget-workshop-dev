# Multiple displays: saves are facts, messages are hints

allowMultipleInstances=true permits enabled instances on different monitors, still at most one per monitor. Configuration/KV stay instance-local; grants and saves are installation-shared. Do not invent host leader/follower roles or grant permissions through another display's messages.

## Recommended flow

1. Load the successful save and revision.
2. Commit a validated business operation with saves.commit.
3. After success optionally publish a {revision} collaboration hint.
4. Other instances poll collaboration.get with their own afterId and load the real save when a new hint appears.

Validate hint content and loaded snapshots. Supplement messages by loading on visibility/resume, before important operations or at an appropriate bounded interval. Consumers must tolerate missed messages.

## A latest value is not a durable queue

Each installation keeps only its newest message for up to thirty seconds, with a 16 KiB value limit. Publishing replaces older messages; slow consumers miss intermediate values and restart loses everything. Per-installation publishing allows at most four attempts/second and sixty/minute; never broadcast every frame. See [the complete contract](../reference/contracts/collaboration.md).

Messages are not save receipts, permission delegation, account sharing, cloud synchronization or cross-installation communication. Revocation, reload, disablement, package changes and source-document invalidation may discard them. SAVE_CONFLICT still requires reload/merge.

Verify simultaneous writers, replacement/expiry, lost publish responses, resume reload, revocation and document closure. Physical multi-monitor behavior requires actual monitor testing rather than a service fixture.
