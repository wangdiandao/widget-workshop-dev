# Maintenance Policy

This repository does **not accept external contributions**, including code, documentation, translations, examples, Skills or pull requests. External users may only open Issues to report problems, request features or ask questions. External pull requests will be closed without merging. Never include secrets, access tokens, private files or personal data in an Issue.

## Maintainer workflow

The repository owner uses an Issue-driven workflow for all changes:

1. Find or create an Issue in this repository with the problem, scope and acceptance criteria. Host synchronization Issues identify source files and author-visible behavior.
2. Branch from current main using `docs/<issue>-<topic>`, `fix/<issue>-<topic>`, `feat/<issue>-<topic>` or `chore/<issue>-<topic>`. Keep one primary Issue per delivery.
3. Update documentation before implementing behavior. The host owns SDK and contract definitions. Synchronize generated references, then review both language editions of guides, recipes and references, and update English Skills.
4. Run `npm run check` and `npm run docs:build`. For host changes also run `node tools/sync-host.mjs --source "E:/repos/Widget Workshop" --check`. Validate new packages in the actual host. Static checks do not establish runtime or device compatibility.
5. Open an owner-authored PR with `Closes #<issue>` and report sources, changes, actual validation and limitations. Issue policy checks ownership, branch numbering and an open Issue in this repository. Validate checks snapshots, plugin metadata, examples, types and the site build.
6. Merge after checks pass. Main triggers GitHub Pages publication. Verify deployment before reporting completion; a successful build alone does not establish a live site.

Do not push implementation changes directly to main. CI provides reviewable checks; repository files alone do not enable server-side branch protection or prevent an administrator from bypassing it.

## Repository boundaries

Agent instructions and Skills use English. Public developer documentation and README provide Chinese and English editions. LICENSE and maintenance/legal notices use English. AGENTS.md is local-only and ignored; do not commit it or add a CLAUDE.md file. Plugin Skills supply shared Codex/Claude Code instructions.

Generated host references and examples must be changed at their host source, then synchronized. SDK files are injected by the host; component packages must not contain widget-host.js, widget-host.d.ts or protocol.json. Do not add host native code, Steam SDK files, build outputs, user data or credentials.
