# Component package contract

The package schemaVersion and hostApiMajor are 1; SDK baseline is 0.1.0. Deliver a directory containing manifest.json, its local HTML entry and local static resources. Users do not run author scripts. entry defaults to index.html; preview defaults to preview.png with a placeholder when implicit and absent. Explicit previews must exist and be PNG.

## Manifest fields

Required identity fields include kind: widget, a UUID widgetId, three-part numeric version, nonempty name/author and matching hostApiMajor. Optional description/tags/i18n/entry/preview/window/capabilities/configuration follow the current schema. Unknown top-level fields, capabilities and field types are rejected. Capabilities are unique names, not grant requirements. configuration is an array with unique keys.

allowMultipleInstances defaults false: one enabled intent across displays, including hidden/disconnected states. When true there is still at most one instance per installation per display. Installation identity is distinct from the author's widgetId, and cross-source duplicate additions are rejected.

## Window defaults

| Field | Default and rule |
| --- | --- |
| size.width / height | 320 / 200 DIP; finite positive, at most 1,000,000 |
| minWidth / minHeight | 1 / 1 DIP, no greater than initial size |
| layer | bottom; top is also valid, initial preference only |
| surface.transparent | false |
| cornerRadius | 8 DIP opaque, 0 transparent; range 0–64, transparent only 0 |
| inputMode | rect; transparent also allows regions/none, opaque only rect |

Positions are host-chosen and cannot be specified as monitor/screen coordinates in the manifest. Layouts do not override author dimensions. CSS does not change native layer, hit testing or display identity.

## Resources and budgets

Paths must be safe package-relative paths without URLs, absolute roots, traversal or links. Bundle scripts/frameworks; remote JavaScript and native DLL/EXE extensions are not allowed. The three reserved SDK filenames are rejected anywhere, case-insensitively.

Defaults: manifest 256 KiB; preview PNG 1 MiB with longest side 4096 pixels; individual asset 64 MiB; package 256 MiB and 10,000 files. Content hashes establish integrity, not publisher trust. Local import accepts directories, not ZIPs. Ordinary import is not a source-directory update mechanism.

See [development](../modules/development.md), [configuration](configuration.md) and [API authorization](host-api.md).

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/component.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md). Review both editions when the host changes.
