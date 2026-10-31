# Reclaimable binary cache

Cache stores reconstructible images, audio or computed results, not game progress. Misses are normal and the host may evict or clear entries at any time. Cache is separate from configuration, saves, layouts and rollback.

cache.get({key}) returns found/bodyBase64 (null on miss); cache.put({key,bodyBase64}) atomically replaces; remove/clear are idempotent. Keys are 1–64 ASCII letters/digits/underscore/hyphen starting with a letter. Standard Base64 represents at most 1 MiB decoded bytes per entry, not a path or executable resource.

Budgets: 16 entries/8 MiB per instance, 64/32 MiB per installation and 256/128 MiB globally. Capacity uses decoded bytes and evicts less-recently-used values first. Entries expire seven days after writing without extension on reads. Valid put attempts count toward thirty/minute per installation and 120/minute globally, including failed commits.

Records are atomically stored and validated by length/digest; corruption is a miss and does not recover from previous metadata. Page reload/hidden state/normal restart may reuse entries, while package, grant or binding changes invalidate installation cache conservatively. Revocation generations prevent late old-document delivery; bytes already delivered cannot be recalled.

The API adds no system-read authority or capability and does not promise data cannot leave a directly networked widget. See [Worker/static fallback](../../recipes/worker-canvas.md).

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/cache.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md). Review both editions when the host changes.
