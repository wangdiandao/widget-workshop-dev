# Understand components

A component is a web content package managed by Widget Workshop. The host owns windows, installation identity, authorization, configuration and delivery. Authors own rendering, business rules, interaction and error states. The target is supported, updated Windows 11 x64 with WebView2, rather than an ordinary browser tab.

## Work, installation and instance

`widgetId` is the work's UUID. An installation owns authorization and updates; an instance runs on one display. The same installation can never have two instances on the same display. `allowMultipleInstances` defaults to false, allowing only one enabled intent across displays. When true, different displays may each run one instance.

Development components are explicitly added through the host's Development page with development identity. Local, development and Workshop sources cannot add the same `widgetId` again. Generate a new UUID when turning an example into a new work.

## Pick the right interface

| Need | Interface |
| --- | --- |
| Rendering | Bundled HTML/CSS/JS, Canvas or WebGL; bundle frameworks locally |
| Display preferences | `manifest.configuration`, `config.get/set` and `config.changed` |
| Small per-display state | `storage.get/set/remove` |
| Persistent game/tool progress | `saves.load/commit`; installation-shared, revision conflicts handled by authors |
| Remote data | Direct fetch/WebSocket/WebRTC or generic host network methods |
| Desktop integration | Documented bounded host APIs, without arbitrary commands or native plugins |

Start with the [counter quickstart](quickstart.md), then explore [examples and solutions](../recipes/index.md) for your component. Read the [glossary](../reference/glossary.md) for identity and ownership terms.

Weather, calendar, todo and notes ship with the host. This repository's examples are reading and local development inputs; they are not automatically installed or included in host distribution.
