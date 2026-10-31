# Recipes and solutions

Start from the closest example and remove unneeded integrations. Host-synchronized examples preserve their original structure. counter and information-feed are introductory examples written for this guide. Check packages in the host before enabling them; nothing is installed automatically.

Combine and extend these patterns to develop components for your own requirements.

| Goal | Recipe | Source |
| --- | --- | --- |
| Clickable, draggable transparent character | [Desktop pet](desktop-pet.md) | `examples/transparent-pet` |
| Idle progress and an edge toolbar game | [Game](game.md) | `examples/edge-garden` |
| News, RSS adapters and dashboards | [Information feed](information-feed.md) | `examples/information-feed` |
| File statistics, images and exports | [File tools](file-tool.md) | `examples/file-tool` |
| Particles, heavy computation, Wasm | [Worker / Canvas](worker-canvas.md) | `examples/stardust`, worker-canvas |
| Progress across displays | [Collaboration](collaboration.md) | saves plus latest-value hints |
| Panels, credentials, media and capture | [Desktop integration](desktop-integration.md) | documented contracts |

Examples are source material rather than framework dependencies. Generate a new `widgetId` for a new work. Do not copy this entire repository or SDK reference files into a component package.
