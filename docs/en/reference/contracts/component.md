# Component package contract

The package `schemaVersion` and `hostApiMajor` are 1; the current SDK is 0.1.2, with independent [versioning rules](../modules/development.md#author-sdk-versioning). Deliver a directory containing `manifest.json`, its local HTML entry and local static resources. Users do not run author scripts. entry defaults to `index.html`; preview defaults to `preview.png` with a placeholder when implicit and absent. Explicit previews must exist and be PNG.

## Runtime compatibility

Interface deprecation and retirement follow the [SDK compatibility policy](../modules/development.md#sdk-compatibility-and-interface-retirement).

Component `version` orders work updates, SDK versions identify development and diagnostic releases, `schemaVersion` identifies manifest structure, and `hostApiMajor` identifies the interface and behavior generation. SDK releases need not match exactly. Published contracts stay compatible within a generation; cross-generation support covers only explicitly implemented and verified generations. Currently only manifest schema 1 and API generation 1 are supported for installation and execution.

Optional `requiredFeatures` defaults to an empty array. It contains at most 256 unique, case-sensitive identifiers, each 1–128 ASCII letters, digits, dots, underscores or hyphens, matching the host handshake feature catalog. Unknown well-formed identifiers are missing mandatory features; malformed or duplicate entries are invalid manifests. Require only essential functionality. Probe optional features and degrade gracefully. Denied capabilities do not make a component version incompatible and do not prevent enabling it. Breaking changes to existing feature semantics require a new API generation; an SDK version increment alone is insufficient.

For example, `"hostApiMajor": 1, "requiredFeatures": ["saves.load", "saves.commit"]` requires that generation and both features. Older hosts may reject this added manifest field; forward readability is not promised.

Package checking, import, Workshop downloads and development reloads reject incompatible inputs with PROTOCOL_UNSUPPORTED and the required generation or missing features. First-install failure creates no installation; Workshop subscriptions and the failure reason remain. Failed updates preserve the active version, data and grants. Activation, layout apply/restore and final transaction commit recheck compatibility.

An installed manifest with readable, valid structure is retained even if it cannot run. The host preserves installation, configuration, saves, KV, grants, bindings and enabled intent, shows a plain-language incompatibility notice and status badges, and creates no runtime for it. Other compatible components can recover normally. The management enable switch is disabled while incompatible, including when enabled intent is already on. Removing the component and trusted disable commands (including Disable all) remain available; disabling still cancels enabled intent. User-facing status does not expose API names, feature identifiers or API-generation diagnostics; author package checks retain these details. Compatibility is derived from the current host rather than persisted as another switch. Restart or an installation update reevaluates it; enabled components resume automatically when compatible, while explicitly disabled components remain disabled and disconnected displays wait for reconnection. Unknown schemas and corrupt data follow the format rules rather than being guessed or silently cleared.

Any incompatible layout dependency blocks applying or restoring the whole layout and leaves the current layout intact. Rollback does not restore earlier saves, KV or permissions; authors own compatibility of their business data.

## Manifest fields

Required identity fields include kind: widget, a UUID `widgetId`, three-part numeric version, nonempty name/author and matching `hostApiMajor`. Optional description/tags/i18n/entry/preview/window/capabilities/configuration/requiredFeatures follow the current schema. Unknown top-level fields, capabilities and field types are rejected. Capabilities are unique names; the array may be empty. configuration is an array with unique keys.

`allowMultipleInstances` defaults false: one enabled intent across displays, including hidden/disconnected states. When true there is still at most one instance per installation per display. Installation identity is distinct from the author's `widgetId`, and cross-source duplicate additions are rejected.

## Content tags

Use the exact English values `information`, `productivity`, `system`, `files`, `media`, `decoration`, `entertainment`, `education`, `lifestyle` and `development`. Entertainment includes desktop pets and games. The host localizes their display names; tags do not grant capabilities. `Widget` and `Layout` are generated Workshop content types, not author tags.

Tag values in `manifest.tags` are case-sensitive lowercase identifiers. In `protocol.json.contentTags`, `name` is the identifier; `enUS` and `zhCN` are the English and Simplified Chinese display labels. SDK 0.1.1 requires changing previous capitalized tag values to lowercase; capitalized values are treated as unknown.

## Window defaults

| Field | Default and rule |
| --- | --- |
| `size.width` / height | 320 / 200 DIP; finite positive, at most 1,000,000 |
| `minWidth` / `minHeight` | 1 / 1 DIP, no greater than initial size |
| layer | bottom; top is also valid, initial preference only |
| `surface.transparent` | false |
| `cornerRadius` | 8 DIP opaque, 0 transparent; range 0–64, transparent only 0 |
| `inputMode` | rect; transparent also allows regions/none, opaque only rect |

Positions are host-chosen and cannot be specified as monitor/screen coordinates in the manifest. Layouts do not override author dimensions. CSS does not change native layer, hit testing or display identity.

## Resources and budgets

Paths must be safe package-relative paths without URLs, absolute roots, traversal or links. Bundle scripts/frameworks; remote JavaScript and native DLL/EXE extensions are not allowed. The three reserved SDK filenames are rejected anywhere, case-insensitively.

Defaults: manifest 256 KiB; preview PNG 1 MiB with longest side 4096 pixels; individual asset 64 MiB; package 256 MiB and 10,000 files. Content hashes establish integrity, not publisher trust. Local import validates and copies a component directory into a new installation.

See [development](../modules/development.md), [configuration](configuration.md) and [API authorization](host-api.md).

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
