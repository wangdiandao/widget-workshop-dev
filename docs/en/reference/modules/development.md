# Development and author SDK

The host injects SDK before page scripts and reloads. Bind a runnable directory rather than a development server. Source changes stabilize for at least one second, then copy/validate into an immutable version. Invalid candidates and missing directories preserve the last usable installation. Unsaved configuration drafts postpone automatic activation; manual actions preserve save/discard/continue editing. The project actions are Open folder, Reload and Publish. Removal preserves author source; after moving a directory, remove the development installation and add it from the new location. Developer tools require an enabled ready display instance. Maintenance offers Remove and Edit configuration, without manual restoration of a previous package. See the lessons for race and cleanup patterns.

## Sources and author guidance

Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.

## Author SDK versioning

SDK releases evolve independently under the compatibility policy below. The current version is `0.1.2`, independently using `major.minor.patch`. `sdkVersion` in the host protocol is the current version source. Keep JavaScript, declarations, machine protocol, host distribution, examples and both guide editions synchronized when the SDK changes.

During `0.x`, increment patch for routine additions and fixes, including limited protocol adjustments such as content tags. Increment minor and reset patch only when the user explicitly decides to enter a new SDK feature stage. Document affected methods, types, events and required author changes for any break. Starting at `1.0.0`, increment major for incompatible changes, minor for compatible additions and patch for fixes; reset all fields to the right. Use the highest-impact change once per SDK delivery. Host UI, internal refactoring, packaging and prose-only changes do not automatically change the SDK version. Different distributed SDK content must not reuse a version; comment/format-only changes are excluded.

`hostApiMajor/apiMajor`, bridge `protocolVersion` and each data format version describe separate contract generations. Update only the generation whose contract changes; do not copy SDK or application version numbers into them. Optional additions with unchanged defaults retain their schema; breaking changes increment the affected format. Supported migration inputs and lower bounds must be explicitly documented and validated. The current canonical formats use v1; historical variants are not accepted merely because they share that number. SDK changes still follow the SDK versioning rules and explain author impact. Component/layout manifest versions remain their own three-part versions. See [format compatibility](../../guide/sources.md#formats-and-compatibility).

The application separately uses four fields (`major.minor.patch.revision`). Development uploads retain the previous default application's version. Only after an explicit decision to update Steam default is the release version incremented once, based on all changes since the previous default, followed by validation, develop upload and default promotion. This does not automatically increment the SDK.

Component requirements and enabled-intent recovery follow [runtime compatibility](../contracts/component.md#runtime-compatibility).

## SDK compatibility and interface retirement

### Compatibility within a generation

Preserve published interfaces and behavior within the same `hostApiMajor/apiMajor`, including during `0.x`. SDK version changes, refactoring, maintenance cost and usage levels do not justify removing an interface. Compatible additions retain existing calls and introduce stable feature identifiers. Fixes restore the published contract rather than changing valid calls.

Removing methods, types or events, changing arguments, results, authorization, data ownership or cancellation semantics, or narrowing published valid inputs, budgets or guarantees is a breaking change. Increment the affected API generation and follow the retirement conditions. SDK version increments cannot replace API generation changes. Cross-generation support covers only explicitly implemented, documented and verified ranges; there is no automatic previous-generation or perpetual multi-generation promise. A generation still advertised as supported must retain its published interfaces.

### Deprecation and permanent retirement

Deprecation recommends migration while the interface remains callable and truthfully advertised. When declaring an actual deprecation, mark declarations with `@deprecated`, supply a replacement and migration guide, and stop using the old interface in new templates. Deprecation does not automatically expire an interface.

Ordinary permanent retirement requires all of the following:

1. A replacement, migration guide, and runnable test host and SDK are available to authors, identifying affected methods, types, events and widget impact.
2. A public deprecation announcement identifies scope, migration and earliest retirement conditions. Count at least 90 complete days from the latest availability of the announcement and all materials above.
3. At least two distinct Steam `default` releases after that starting point provide advance notices describing impact and migration. `develop` uploads, repeat uploads, documentation-only updates and the release performing retirement do not count as advance notices. Both elapsed time and release count must be satisfied, whichever is later.
4. Verify that blocking old widgets preserves installation data and enabled intent, with automatic recovery when compatibility returns. Revocation, uninstall and later user disable actions take precedence; never restore revoked grants or deleted data.
5. The user explicitly decides to retire the affected generation in a specified `default` release. Synchronize supported ranges, contracts, SDK, messages and verification. Elapsed time or a `develop` upload does not authorize retirement.

Expanded retirement scope or an incompatible migration target requires renewed notice and grace for the new impact; compatible fixes that preserve the migration contract do not restart the period. A next-generation test host may enable migration before the new `default` release; dual-generation execution in the production host is not required. Without verified cross-generation support, block old widgets under [runtime compatibility](../contracts/component.md#runtime-compatibility), showing plain widget incompatibility rather than interface diagnostics.

### Serious security vulnerability exception

A confirmed serious security vulnerability may require immediate blocking of affected features without the ordinary grace period. Explain scope and reason, preserve unaffected data and enabled intent, check the block at execution and final delivery, and do not advertise blocked features as usable. Recovery still respects revocation, uninstall and current user intent. Cost, refactoring and low usage do not qualify. A temporary security block does not itself satisfy ordinary permanent retirement conditions.

No interfaces are currently declared deprecated or retired, and this policy introduces no security block or SDK, API-generation or format-version changes.
