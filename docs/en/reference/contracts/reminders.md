# Persistent reminders

Reminders reuse the optional notifications capability. Delivery only happens while the host runs, including tray mode. Full exit stops delivery; restart resumes still-valid records. No system scheduled background service is installed.

`reminders.set` accepts {key,`dueAt`,`expiresAt`,title,body}; it replaces that instance key after a successful commit. Keys are 1–64 ASCII letter/digit/underscore/hyphen starting with a letter. Times are UTC Unix milliseconds: `dueAt` is future and within thirty days, `expiresAt` is after `dueAt` and at most twenty-four hours later. Notification text limits apply.

list returns current unconsumed/unexpired instance records in due order, without history. remove/clear are idempotent cleanup and do not require notifications authorization, but still require an active valid original instance.

Limits: eight records/instance, thirty-two/installation, 128 global. Valid set attempts: thirty/minute per installation and 120 global. Delivery shares notification quotas of three/minute per installation and ten global, retaining blocked records until later checks or expiry. Approximate one-second checks do not promise exact timing; clock rollback delays and large jumps may expire records.

Hidden/reload/package switches preserve valid reminders. Disablement, instance deletion, uninstall or notification-trust changes clear them, without resurrection after regrant. Layouts do not copy reminders. Records are current-only atomic state, independent of metadata rollback.

A due record is removed before at-most-once delivery is attempted. Crashes or shell rejection can lose it; API success is not proof the user saw a notification. Cancellation does not retract a committed edit. Separate confirmed modification feedback from a cancelled follow-up list refresh. See [local development lessons](../../guide/lessons.md).

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
