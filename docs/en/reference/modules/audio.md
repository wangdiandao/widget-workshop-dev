# Host audio policy

Context `audio.muted` and `audio.changed` expose effective native mute including global policy. Web Audio playback still needs actual initialization and appropriate interaction; API existence does not prove sound. Suspend/lock/hidden policies must be explicit, nodes and `AudioContext` released on leaving. System default output volume and output-loopback capture are separate integrations; widget mute does not guarantee the system mix excludes the widget.

## Sources and author guidance

Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.
