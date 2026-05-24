# Widget Workshop Dev

Widget Workshop Dev is the standalone developer toolkit for creating, validating, reviewing, and troubleshooting Widget Workshop component packages. It ships an AI plugin, focused Skills, component contracts, package schemas, example components, bilingual documentation, and local verification scripts.

The toolkit is modeled after `microsoft/win-dev-skills`: a small installable plugin with an orchestrator agent, task-focused Skills, repository-local scripts, CI validation, and release documentation.

> [!WARNING]
> Preview v0.x. Skill names, package schemas, and validation scripts can change before v1.0. Pin a release tag when you need a stable version.

## Install

### GitHub Copilot CLI

```powershell
copilot plugin marketplace add https://github.com/wangdiandao/widget-workshop-dev
copilot plugin install widget-workshop@widget-workshop-dev
```

### Claude Code

```powershell
claude plugin marketplace add https://github.com/wangdiandao/widget-workshop-dev
claude plugin install widget-workshop@widget-workshop-dev
```

### OpenAI Codex

Add `https://github.com/wangdiandao/widget-workshop-dev` as a plugin marketplace, then enable the `widget-workshop` plugin. Codex may expose Skills directly rather than the orchestrator agent; invoke the Skill that matches the task.

## Quick Start

Ask the agent or a compatible coding assistant:

> Create a Widget Workshop component from this idea: a compact world clock with custom accent color.

For local package validation without an AI assistant:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path .\examples\minimal-clock
```

## Repository Layout

```text
.github/plugin/                  Marketplace manifest
.github/workflows/               CI and release-policy checks
plugins/widget-workshop/          Plugin manifests, orchestrator agent, and Skills
docs/en-US/                       English component developer docs
docs/zh-CN/                       Chinese component developer docs
contracts/                        Host API and category contract snapshots
schemas/                          JSON schemas for component files
examples/minimal-clock/           Minimal valid component package
scripts/                          Validation and contract-sync scripts
```

## Skills

| Skill | Use it for |
|---|---|
| `widget-workshop-workflow` | Choosing the right Widget Workshop Skill, repository sources, validation gate, and contract-sync path. |
| `widget-workshop-api` | Checking `window.widgetWorkshop`, permission categories, `manifest.json`, settings schemas, categories, and runtime API errors. |
| `widget-workshop-code-review` | Reviewing component packages before local sharing or Steam Workshop publication. |
| `widget-workshop-dev` | Writing component folders, manifests, `index.html`, settings, locales, preview assets, styling, and runtime code. |

## Documentation

- [English component developer docs](docs/en-US/README.md)
- [中文组件开发者文档](docs/zh-CN/README.md)
- [Manifest schema](schemas/manifest.schema.json)
- [Settings schema](schemas/settings.schema.json)
- [Host API types](contracts/host-api.d.ts)

## Validation

Run the full local gate before pushing:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Plugin.ps1 -PluginPath .\plugins\widget-workshop
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path .\examples\minimal-clock
git diff --check
```

When a local Widget Workshop app checkout is available, also verify that contract snapshots still match the host source:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```

## Pinning To A Release

```powershell
copilot plugin install https://github.com/wangdiandao/widget-workshop-dev.git#v0.1.0
claude plugin install https://github.com/wangdiandao/widget-workshop-dev.git#v0.1.0
```

## Release Flow

Day-to-day work lands on `staging`. Promotion PRs from `staging` to `main` update `CHANGELOG.md` and keep `.github/plugin/marketplace.json`, `plugins/widget-workshop/plugin.json`, `.codex-plugin/plugin.json`, and `.claude-plugin/plugin.json` on the same version. See [RELEASING.md](RELEASING.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [SUPPORT.md](SUPPORT.md), and [SECURITY.md](SECURITY.md). This project is licensed under the [MIT License](LICENSE).
