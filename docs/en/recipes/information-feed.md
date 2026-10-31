# Information feeds: one refresh and safe display

`examples/information-feed` defaults to bundled demonstration data. Only a configured endpoint enables remote requests. It uses `network.request`, instance KV for the last successful snapshot, and optional `external.open` authorization. Denied article opening does not prevent reading.

## Adapter contract

The input is a JSON object with an items array. Each item contains a stable string id, a plain title and an optional HTTPS url. The sample is not an RSS parser. Implement a bounded RSS/Atom adapter before normalization if needed; never execute provider XML/HTML through `innerHTML`.

The sample inspects at most 500 input rows, displays 50, bounds titles to 200 characters and IDs to 128, and accepts only credential-free HTTPS URLs up to 2048 characters. Titles use `textContent`.

## Refresh state machine

Read the last successful snapshot, then refresh. Keep one current request, cancel it on replacement and reject stale generations. The example deadline is twelve seconds; refresh periods range from 30 to 3600 seconds. Schedule the next refresh after completion.

Pause nonessential work on hidden, locked, suspended and `pagehide` states. Resume using current configuration. On non-2xx status, invalid encoding/JSON, excess size or invalid models, retain the old content with a failure label. If fresh content succeeds but snapshot persistence fails, report that separately. Avoid unbounded retries.

## Accounts and extensions

Public feeds need no secret. For accounts, consult provider documentation and keep tokens in credentials or user-bound secrets, never URLs, shared configuration, packages or logs. Networking is not a capability. Browser fetch and host HTTP proxy constraints differ; do not evade them with arbitrary proxies or remote scripts.

Extend with stable-ID deduplication, read state, source switching or static summaries, with separate budgets. Cache is not a reliable permanent save. Verify denied links, malicious text/URLs, offline failure, timeout, rapid refresh, configuration changes and stale completion.
