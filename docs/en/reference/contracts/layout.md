# Layouts

A layout describes one display's components, enabled/visible state, mute, positions, order and configuration. It does not grant, revoke or restore capabilities. Layout library entries are snapshots of that same format.

Applying replaces only the selected display after dependency preflight. Missing dependencies block application without auto-subscription. Failure preserves usable state and a recoverable snapshot. User-authored component size is not overwritten by layouts.

Installation authorization, resource bindings, secrets, component credentials, KV, saves, cache and reminders have their own ownership; a layout/package rollback is not a progress or permission backup. Shared configuration obeys field types and sharing policy.

Component references contain only `widgetId` (UUID) and `hostApiMajor`. Layouts do not store component source or Workshop item IDs. Dependencies match installed components by UUID across local, development and Workshop sources; ambiguous duplicate installations are rejected. Workshop publishing uses the same references without rebinding. Removing an installation clears its personal configuration from saved layouts and restore snapshots before another source can satisfy that UUID.

Display IDs are stable internal identities, not connection order or display numbers. Disconnection preserves intent without silently migrating content. Global language/theme/autostart and local display aliases are not shared layout settings.

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
