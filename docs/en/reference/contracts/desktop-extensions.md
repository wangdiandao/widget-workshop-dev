# Desktop extensions

All calls require a valid enabled instance/document. The host owns authorization, bounded resources and final-delivery checks; cancellation does not roll back external effects.

## Directories and exports

directory.write requires its grant and a user-selected binding. It writes at most 4 MiB, defaults overwrite:false, stages/flushed content then atomically replaces. mkdir creates one level; rename stays within one binding and rejects existing targets; remove permanently deletes one ordinary file or empty directory, without recursion/recycle bin. Roots, traversal, device names, reparse points, alternate streams and empty paths are rejected.

exports.startDrag reuses completed staged output and requires an actual native primary-mouse drag in the current visible document. It offers COPY only; accepted is not proof of final persistence. No author-declared trusted event or staging path is exposed.

## Actions and capture

shortcuts.setActions registers at most eight actions, without key combinations. The user assigns instance shortcuts in host UI; conflicts do not replace usable settings. Hidden instances may respond, paused/locked events are discarded, and disable/disconnection/exit releases registration. It is not a keyboard listener.

audio.capture samples default output mix, not microphone. open returns format/sampleRate/channels; read pulls up to 4096 frames and may return zero with droppedFrames. One session per instance, four global, bounded to one second of PCM with oldest-frame dropping. Hidden capture can continue; pause/lock/sleep/navigation/disable/device changes end it without automatic restart.

## Notifications, panels and credentials

Immediate notifications support bounded actions and dismiss of a valid original-document notificationId. Dismiss does not enumerate/read notifications or prove display/read state. IDs expire and do not survive reload/revocation/restart.

Panels open only package-local pages. They share instance identity, grants, configuration and saves, but each has a separate document session. Use post/closed events and explicit close/activation; no arbitrary remote iframe or new installation is created.

credentials stores the component's installation-scoped keys with current-user DPAPI protection and atomic writes. It is separate from user secret bindings, which remain references. Login, token refresh and server-side revocation are author/provider responsibilities; there is no host account service. See [full types](../types.md) and [desktop recipes](../../recipes/desktop-integration.md).

## Source and related declarations

This English reference describes the same current contract for authors. The [synchronized source-language contract](../../../reference/contracts/desktop-extensions.md) retains the host's full wording. Exact method signatures and complete machine budgets are shared in [SDK declarations](../types.md). Review both editions when the host changes.
