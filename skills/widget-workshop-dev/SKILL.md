---
name: widget-workshop-dev
description: Build, modify, debug or review Widget Workshop components, including SDK lookup, package setup, configuration, permissions, lifecycle and persistence.
---

# widget workshop dev

The plugin root is two directories above this file. Resolve all paths from that root, not from the user's current working directory. Start with [the task guide](../../docs/en/guide/quickstart.md) and [the API reference](../../docs/en/reference/index.md). Chinese material is available under docs/; the SDK files retain their original comments and identifiers.

## Workflow

1. Read the overview, quickstart and package guide. Inspect examples/counter for a minimal complete package. Determine the final runnable directory; the host never runs an author's build commands.
2. Identify the author-visible result, data ownership, required failure states and runtime verification. Resolve material ambiguity with one focused question while progressing on independent work.
3. Generate a new widgetId for a new work. Keep an existing identity when updating it. The host rejects cross-source duplicate widgetIds; same-monitor duplicates are never supported.
4. Use a complete schemaVersion=1, kind=widget, hostApiMajor=1 manifest. Configuration is a field array. Default to an opaque surface and no capabilities. Read the actual declaration before selecting any capability.
5. Wait for widgetHost.ready before calls. The host injects the SDK; do not bundle widget-host.js, widget-host.d.ts or protocol.json, and do not add an SDK script tag. Worker code has no direct bridge.
6. Register pagehide cleanup before asynchronous initialization. Track document validity, cancel calls, timers and streams, unsubscribe events, and prevent late success or failure from updating old DOM. Bound input, work queues, request count and retries.
7. Deliver the runnable static package. Run relevant static checks and the actual host's read-only package checker when available. Tell the user exactly which runtime paths were tested; do not substitute browser rendering for desktop verification.

## API lookup and review

Read docs/public/sdk/widget-host.d.ts for exact request/result types and docs/public/sdk/protocol.json for features and budgets. Read the relevant docs/en/reference contract before implementing a host call. Check authorization, ownership, expiry, cancellation and errors, not just argument types. The six capabilities are external.open, location, notifications, clipboard, directory.write and screen.capture; networking and documented base interfaces work without authorization.

During review, trace asynchronous work through completion and cleanup; inspect denial/revocation, stale successes and failures, scoped resources, CAS saves, native hit regions and package contents. Lead with actionable defects, locations, consequences and repairs. Report only validation actually executed. Static checks are not actual WebView, input-device or multi-monitor tests.

For concrete implementations and lessons from local development, use the sibling widget-workshop-examples Skill and its routing table rather than loading every recipe.

## Deliverable

Provide the requested runnable change or an evidence-backed answer. Explain changed behavior, actual checks and remaining limitations. Do not install or publish a component, plugin or account connection unless the user's request authorizes it.
