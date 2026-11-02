# References

The baseline is Widget Workshop SDK 0.1.2, `hostApiMajor`=1 and `protocolVersion`=1. The host SDK and owning contract/module files remain the authority; `host-snapshot.json` identifies synchronized inputs.

## Formats and compatibility

Component packages, layouts and host save envelopes currently use canonical v1, managed independently from application, SDK and work versions. Optional additions with unchanged default behavior keep the schema. Removing fields or changing types, meaning, identity or required structure increments the affected format.

New hosts continue reading previously published valid structures within the same schema; older hosts are not guaranteed to accept new fields. Unknown fields remain errors. Cross-schema readers and migrations accept only explicitly documented, validated inputs and lower bounds, rather than automatically limiting support to the previous generation or accepting arbitrary historical variants. Current packages and layouts accept canonical v1 only, with no automatic legacy conversion; old layouts carrying component source fields are outside that canonical format.

The host does not rewrite author save payloads. Version and upgrade your own `value` independently of the host envelope. Rolling back an application binary does not downgrade data and must not restore revoked authorization or roll back progress.

## Official references

- [VitePress 1.6.4 deployment](https://vuejs.github.io/vitepress/v1/guide/deploy): docs builds, repository base and Pages workflow.
- [VitePress localization](https://vuejs.github.io/vitepress/v1/guide/i18n): Chinese root and English /en/ edition.
- [Local search](https://vuejs.github.io/vitepress/v1/reference/default-theme-search): browser search index.
- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins): portable root manifest, Codex compatibility and marketplaces.
- [Claude Code manifest](https://code.claude.com/docs/en/plugins-reference) and [marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).
- [Vite 6.4.5](https://github.com/vitejs/vite/releases/tag/v6.4.5): the explicitly selected patched build override.
