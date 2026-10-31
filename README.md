# Widget Workshop Component Development

[简体中文](README.zh-CN.md) · **English**

Develop components for Widget Workshop with HTML, CSS and JavaScript. This repository provides developer guides, current host API references, examples and a Codex/Claude Code plugin.

**[Documentation](https://wangdiandao.github.io/widget-workshop-dev/en/) · [Quickstart](docs/en/guide/quickstart.md) · [Examples and solutions](docs/en/recipes/index.md) · [API reference](docs/en/reference/index.md) · [Report an issue](https://github.com/wangdiandao/widget-workshop-dev/issues/new/choose)**

## Run the documentation locally

Use Node.js 22 or newer:

```sh
npm ci
npm run check
npm run docs:dev
```

Build with `npm run docs:build` and preview with `npm run docs:preview`. Chinese documentation is at the site root; English documentation is under `/en/`.

## Install the development plugin

The repository root is the plugin. It bundles documentation, SDK type references and two English Skills:

- **widget-workshop-dev** — development, API lookup, debugging and review.
- **widget-workshop-examples** — examples, solutions and [local-development lessons](docs/en/guide/lessons.md), loaded as needed.

Codex CLI:

```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

Claude Code:

```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

For local use, run `claude --plugin-dir .`, or register the repository with `codex plugin marketplace add .` and install the same plugin name. See the [plugin guide](docs/en/guide/ai-plugin.md) for usage.

## Repository contents

| Directory | Contents |
| --- | --- |
| docs/guide, docs/en/guide | Component development guides |
| docs/recipes, docs/en/recipes | Examples and solutions |
| docs/reference, docs/en/reference | Host API and protocol references |
| docs/public/sdk | Development-only declarations and machine protocol |
| examples | Example component source |
| skills | Shared Codex / Claude Code Skills |
| tools | Repository tooling |

The host provides SDK 0.1.0 with `hostApiMajor` and `protocolVersion` set to 1. Use the declarations for development, but do not bundle SDK files into a component. See the [reference](docs/en/reference/index.md) and [third-party notices](THIRD_PARTY_NOTICES.md).

## Feedback

External contributions and pull requests are not accepted. Report problems or suggest features through [Issues](https://github.com/wangdiandao/widget-workshop-dev/issues/new/choose). See [Contribution Policy](CONTRIBUTING.md).
