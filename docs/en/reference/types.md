# SDK declarations and machine protocol

The baseline is SDK 0.1.0, `hostApiMajor`=1 and `protocolVersion`=1. [Download declarations](/sdk/widget-host.en.d.ts) or [machine protocol](/sdk/protocol.en.json) for development outside the package. Never include them in a runnable component.

The declarations define method/event shapes; [contracts](contracts/host-api.md) own authorization, failure, lifetime and cancellation. Type-checking does not prove a device or permission is available.

<<< ../../public/sdk/widget-host.en.d.ts

## Complete feature and budget data

The same machine protocol is used by both language editions. Feature presence indicates host support, not a grant or successful device test.

<<< ../../public/sdk/protocol.en.json
