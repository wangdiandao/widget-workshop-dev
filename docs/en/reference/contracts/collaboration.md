# Installation collaboration messages

All instances of an installation may publish/read a temporary latest value. Authors cannot select another installation, instance or path, and this adds no capability.

`collaboration.publish` accepts {value} and returns {id}. JSON UTF-8 is limited to 16 KiB. `collaboration.get` accepts {`afterId`:null|UUID} and returns {found,id,value}; absent, unchanged or expired records return found:false with null id/value. Each consumer owns its own cursor; reads do not consume or acknowledge messages.

Only one latest record exists per installation and expires after thirty seconds of monotonic time. New values replace old values; slow consumers may miss messages and restart loses them. Global retention is at most 64 records/1 MiB of bodies, with bounded dependency metadata; this is not a hard total-process memory claim.

Valid publication attempts are limited to four/second and sixty/minute per installation, 240/minute globally. No durable history, long waits, unbounded queues or implicit retries are provided.

Reload, disablement, package/source changes, revocation or binding invalidation can discard records. Execution and final delivery validate original document/installation generations. Already delivered bytes cannot be withdrawn.

Publish a save revision hint only after commit; recipients still load the successful save. A message is not progress, a save receipt, a permission delegation or cloud sync. See [the collaboration recipe](../../recipes/collaboration.md).

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/collaboration.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
