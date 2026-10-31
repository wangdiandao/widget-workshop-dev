---
name: widget-workshop-examples
description: Select and adapt practical Widget Workshop examples and local-development lessons for pets, games, feeds, file tools, Worker/Canvas/Wasm, collaboration and desktop integrations.
---

# Widget Workshop examples and solutions

The plugin root is two directories above this file. Resolve paths from that root. Read [the recipe index](../../docs/en/recipes/index.md) and [lessons from local development](../../docs/en/guide/lessons.md). Load only the scenario needed for the current task, rather than every example. For general development, API lookup and review, use the sibling widget-workshop-dev Skill.

## Choose a recipe

| User intent | Read | Inspect source |
| --- | --- | --- |
| Minimal component, durable counter | [Quickstart](../../docs/en/guide/quickstart.md) | examples/counter |
| Transparent pet, native hit shapes, dragging | [Desktop pet](../../docs/en/recipes/desktop-pet.md) | examples/transparent-pet |
| Idle/edge game, offline calculation, saves | [Game](../../docs/en/recipes/game.md) | examples/edge-garden |
| JSON feed, RSS adapter or status panel | [Information feed](../../docs/en/recipes/information-feed.md) | examples/information-feed |
| File statistics, images, export, directory watch | [File tool](../../docs/en/recipes/file-tool.md) | examples/file-tool |
| Heavy calculation, particles, canvas, Wasm | [Worker / Canvas](../../docs/en/recipes/worker-canvas.md) | examples/worker-canvas, examples/stardust |
| Shared progress on multiple monitors | [Collaboration](../../docs/en/recipes/collaboration.md) | saves and collaboration contracts |
| Panels, credentials, media, capture, reminders | [Desktop integration](../../docs/en/recipes/desktop-integration.md) | exact SDK types and relevant contract |

## Adapt the example

1. State what the source implements and what the extension adds. Host examples are not automatic installations or proofs of all devices. Generate a new widgetId for a new work.
2. Read docs/public/sdk/widget-host.d.ts and the relevant contract. Inspect synchronized source-language wording for detailed boundaries. Never invent capabilities or infer authorization from method availability.
3. Use per-display configuration for appearance, instance KV for local state and installation saves for shared progress. Use CAS revisions; collaboration is a temporary hint rather than a save receipt.
4. Apply local lessons: one current operation plus latest intent; generation checks for stale configuration/results; independent lock and suspension reasons; explicit resource ownership; bounded queues/retry; a usable initial/fallback state.
5. Pets separate visual transparency from native hit regions, include form controls and host edit recovery, and respect autonomous-movement preference. Games bound offline time, validate saves and handle conflicts. Feeds validate data/URLs, render text and retain a labeled successful snapshot.
6. Workers have no host bridge. Use local code, task IDs, consumption acknowledgements and explicit retry. Rebuild transferred canvas resources on user retry; pagehide only releases and never reconstructs old DOM.
7. Close temporary file/capture/stream/export resources on every path. Cancellation cannot retract committed saves, exported files, clipboard values or reminders. Separate confirmed mutation from cancelled follow-up reads. Keep mutation slots occupied until cleanup finishes.
8. Query current official provider/library documentation for third-party integrations. Tokens belong to credentials or user-bound secrets, never query strings, logs, shared configuration or packages. The host has no provider-specific account authorization service.

## Verify and report

Select relevant failure cases from the lessons: slow consumption, rapid intent changes, locked→suspending→unlocked, cancellation around commit, missing cache, invalid input and pagehide. Run relevant static checks and actual host package validation. Only claim runtime, physical-input, device or multi-monitor tests actually performed.

Report changed behavior, source files used, checks and limitations. Do not split scenarios into more Skills; add recipes and route them through this table.
