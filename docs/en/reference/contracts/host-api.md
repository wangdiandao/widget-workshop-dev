# Host API, authorization and errors

SDK 0.2.0 uses `apiMajor`/`hostApiMajor`=1 and `protocolVersion`=1. The host injects `widgetHost` before business scripts. Wait for ready, use call(method, params, {signal}) and retain unsubscribe functions returned by on. Workers have no direct bridge.

## Capabilities and base interfaces

The only manifest capabilities are `external.open`, location, notifications, clipboard, `directory.write` and `screen.capture`. Grants are installation-shared, default denied and individually revocable; denial never prevents enablement.

Base interfaces include configuration, instance KV, saves, generic network, metrics, scoped directory reads/target opening, media, output-loopback capture, pointer/window geometry, output volume and activity state. They work without authorization and obey their resource binding, lifecycle, quota and delivery rules.

HTTP headers choose {name,value} OR {name,`secretBindingId`,prefix?}; plaintext cannot carry prefix. `target.open` chooses {`bindingId`} OR {`directoryBindingId`,`relativePath`}. Mixed forms are rejected.

## Context and events

Context includes identity, view, feature list, limits, configuration, granted capabilities, visible, language, theme, environment, system, audio and runtime. SDK updates context before dispatching corresponding events. language is actual host display language, separate from system locale; theme is actual host appearance, separate from Windows preference.

`accentColor` may be null; `textScaleFactor` is accessibility text scaling, distinct from display DPI. Input regions use local DIP; beginDrag needs native input capture. moveTo is available by default and only moves the current enabled, visible instance inside its work area. Editing, dragging, pause, lock and suspension block movement; pending positions are coalesced without layout persistence and are not replayed after recovery.

## Failure and lifecycle

Public failures include `INVALID_ARGUMENT`, `PROTOCOL_UNSUPPORTED`, `METHOD_NOT_FOUND`, `CAPABILITY_UNDECLARED`, `CAPABILITY_DENIED`, `RESOURCE_UNAVAILABLE`, `NOT_FOUND`, `QUOTA_EXCEEDED`, `TIMEOUT`, `CANCELLED` and `INTERNAL_ERROR`. Saves add their documented conflict errors.

Requests and final delivery validate the original instance/document, cancellation, grants and dependencies. Timeouts, navigation, disablement and revocation invalidate work; cancelling cannot undo already committed side effects. Public errors omit secrets, stack traces and personal paths.

features indicate host support, not authorization or successful device execution. compatibility separates API existence, actual probes and untested devices. Read [complete method/event declarations and machine budgets](../types.md), [saves](saves.md) and the specific desktop contracts before implementation.

## Source and related declarations

Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md).
