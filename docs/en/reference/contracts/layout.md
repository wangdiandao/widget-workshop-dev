# Layouts

A layout describes one display's components, enabled/visible state, mute, positions, order and configuration. It does not grant, revoke or restore capabilities. Layout library entries are snapshots of that same format.

Applying replaces only the selected display after dependency preflight. Missing dependencies block application without auto-subscription. Failure preserves usable state and a recoverable snapshot. User-authored component size is not overwritten by layouts.

Installation authorization, resource bindings, secrets, component credentials, KV, saves, cache and reminders have their own ownership; a layout/package rollback is not a progress or permission backup. Shared configuration obeys field types and sharing policy.

Local layouts may reference development identities without author source paths. Workshop layouts only reference Workshop works and require explicit rebinding from development content. IDs use canonical installation identity rather than display labels or component names.

Display IDs are stable internal identities, not connection order or display numbers. Disconnection preserves intent without silently migrating content. Global language/theme/autostart and local display aliases are not shared layout settings.

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
