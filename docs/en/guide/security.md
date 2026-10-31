# Permissions, resources and networking

Declaration is not authorization. These are the only six valid manifest.capabilities values; all can be denied without blocking enablement.

| Capability | Required fallback |
| --- | --- |
| external.open | Keep in-widget information usable when article links cannot open |
| location | Handle unavailable, timeout, system-disabled and denied states |
| notifications | Keep status readable inside the widget |
| clipboard | Use one grant for text/HTML/image/file operations; no monitoring/history |
| directory.write | Preserve read-only features; writes stay within user bindings |
| screen.capture | Use the system picker; handle cancellation and invalidation |

Networking, metrics, directory reads, media and documented base interfaces are not capability declarations. They still obey resource scope, lifecycle, quotas and final-delivery validation.

## Networking and accounts

Direct fetch/WebSocket/WebRTC are allowed, without a network permission switch or offline guarantee. Browser fetch obeys CORS. Host network methods provide bounded HTTP responses and Base64 bodies; a header chooses plaintext value OR secretBindingId with optional prefix.

Do not evade CORS through arbitrary public proxies, remote scripts or remote embedded pages. The component and provider own login and consent; the host has no provider-specific account API. Consult the selected service's official documentation before choosing a login flow.

## Bound resources and invalidation

Bindings represent user-selected resources, not arbitrary author paths. File open/export retain trusted selectors and overwrite flows. Temporary fileId/exportId/streamId/panelId values expire with their owner/document; do not save them as permanent paths.

After installation authorization, calls do not require repeated copy/link confirmations. Subscribe to capabilities.changed, cancel old work and clear invalid displays. Calls may still fail during execution; handle denial, unavailability and cancellation. Revocation cannot retract bytes already delivered. Never log tokens, bodies, file content or complete personal paths.

Read the [API contract](../reference/contracts/host-api.md) and [account integration](../reference/modules/github.md).
