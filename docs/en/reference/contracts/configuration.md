# Configuration fields and bindings

Configuration is declared as a field array in the manifest. Each key is unique; the host owns validation, draft handling and commits. Values are per instance/display and saved in the active layout, rather than a separate settings file.

## Ordinary fields

Each field requires key, label and type. Keys start with an ASCII letter followed by letters, digits or underscores. description is optional up to 1024 UTF-16 units; group is an optional 1–80-unit heading ordered by first occurrence. Ordinary fields require legal defaults; resource/secret fields default to null and cannot contain author paths, bindings or credentials.

| Type | Value |
| --- | --- |
| boolean | JSON boolean |
| string | String, optional `maxLength` |
| integer | Safe integer, optional minimum/maximum |
| number | Finite number, optional minimum/maximum |
| enum | String from unique nonempty options values |
| multiEnum | Unique string array from options |
| color | Opaque #RRGGBB |
| directory | Host directory `bindingId` or null |
| launchTarget | Host launch-target `bindingId` or null |
| secret | Host secret `bindingId` or null |

Options are value/label pairs. Bounds must be ordered and defaults legal. No nested custom objects, custom HTML editors, executable validators or arbitrary regular expressions are supported. Ordinary `shareable` defaults false; resource/secret fields cannot be `shareable`. On schema changes, the host retains only same-key/type valid values, uses defaults for new/invalid values and removes deleted fields; it never converts secrets to plain strings or restores revoked bindings.

Use current declared types and constraints from the host contract. Provide valid defaults, human-readable labels and explicit sharing choices. `config.get` returns the current complete object. `config.set` accepts ordinary field values and returns the validated committed configuration; it is not a way to create grants or replace resource bindings.

Listen to `config.changed` after initialization and update existing rendering/tasks. Replacing a poll period requires cancelling the old timer. A reload cannot silently discard unsaved management drafts; automatic activation waits and manual actions use the host's save/discard/continue workflow.

## Resources and secrets

Directory, launch-target and secret fields hold a `bindingId` or null rather than an arbitrary author path or secret body. Resource selection belongs to trusted host UI. Author text cannot create authorization. HTTP secret headers use a reference to the chosen secret; component credentials are a separate namespace.

Shared layouts omit private/unshareable values and never grant or restore permissions. A string that resembles a `bindingId` is not evidence that it is a resource reference. Binding replacement/cleanup relies on declared field types. Configuration adaptation is host-controlled; components do not supply migration scripts.

See [SDK types](../types.md), [security](../../guide/security.md) and the synchronized Chinese source for the complete field grammar.

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/configuration.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
