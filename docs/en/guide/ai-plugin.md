# Codex / Claude Code plugin

The repository root is the plugin. English Skills share bundled documentation, types and examples; developer documentation is available in Chinese and English. The plugin adds no MCP service or native execution capability and does not install examples automatically.

## Install

Codex:
```sh
codex plugin marketplace add wangdiandao/widget-workshop-dev --ref main
codex plugin add widget-workshop@widget-workshop-dev
```

Claude Code:
```text
/plugin marketplace add wangdiandao/widget-workshop-dev
/plugin install widget-workshop@widget-workshop-dev
```

For a local Claude preview use claude --plugin-dir . in the repository root. For local Codex registration use codex plugin marketplace add . and install the same plugin name. Check your client's help for version-specific support. Manifest validation does not mean this plugin has been installed or invoked in your client.

## Skills and example prompts

| Skill | Scope | Example task |
| --- | --- | --- |
| widget-workshop-dev | Development, API lookup, debugging and review | Verify save CAS and repair stale callbacks after pagehide |
| widget-workshop-examples | Routed pet/game/feed and advanced recipes | Adapt the pet example with native click-through recovery and local lessons |

Use your client's explicit Skill selector or describe the task naturally. Paths in Skills resolve inside the plugin package rather than to a particular machine.

Ask the agent to read the relevant contract/example, identify ownership and failure states, implement the runnable result and report checks actually performed. Without the actual host, report static verification only.

Repository maintenance uses owner-authored Issue-linked PRs. External users may only open Issues. AGENTS.md is local-only and ignored; no CLAUDE.md is distributed. Both plugin hosts use the shared Skills.
