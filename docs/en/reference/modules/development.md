# Development and author SDK

The host injects SDK before page scripts and reloads. Bind a runnable directory rather than a development server. Source changes stabilize for at least one second, then copy/validate into an immutable version. Invalid candidates and missing directories preserve the last usable installation. Unsaved configuration drafts postpone automatic activation; manual actions preserve save/discard/continue editing. The project actions are Open folder, Reload and Publish. Removal preserves author source; after moving a directory, remove the development installation and add it from the new location. Developer tools require an enabled ready display instance. Maintenance offers Remove and Edit configuration, without manual restoration of a previous package. See the lessons for race and cleanup patterns.

## Sources and author guidance

Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.

## Author SDK versioning

The author SDK is not locked. Its current version is `0.2.0`, independently using `major.minor.patch`. `sdkVersion` in the host protocol is the current version source. Keep JavaScript, declarations, machine protocol, host distribution, examples and both guide editions synchronized when the SDK changes.

During `0.x`, increment minor for public API additions or breaking changes and reset patch; increment patch for contract-preserving implementation or declaration fixes. Document affected methods, types, events and required author changes for any break. Starting at `1.0.0`, increment major for incompatible changes, minor for compatible additions and patch for fixes; reset all fields to the right. Use the highest-impact change once per SDK delivery. Host UI, internal refactoring, packaging and prose-only changes do not automatically change the SDK version. Different distributed SDK content must not reuse a version; comment/format-only changes are excluded.

`hostApiMajor/apiMajor`, bridge `protocolVersion` and each data format version describe separate contract generations. Update only the generation whose contract changes; do not copy SDK or application version numbers into them. Pre-release breaking changes can replace the contract directly without compatibility branches, while still incrementing SDK and explaining author impact. Component/layout manifest versions remain their own three-part versions.

The application separately uses four fields (`major.minor.patch.revision`). Development uploads retain the previous default application's version. Only after an explicit decision to update Steam default is the release version incremented once, based on all changes since the previous default, followed by validation, develop upload and default promotion. This does not automatically increment the SDK.
