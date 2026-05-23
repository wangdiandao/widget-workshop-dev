# Releasing

Widget Workshop Dev uses preview SemVer tags such as `v0.1.0`.

## Release Checklist

1. Start from `staging` with a clean worktree.
2. Run `powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1`.
3. Run `git diff --check`.
4. Update `CHANGELOG.md` for the new version.
5. Keep these versions identical:
   - `.github/plugin/marketplace.json`
   - `plugins/widget-workshop/plugin.json`
   - `plugins/widget-workshop/.codex-plugin/plugin.json`
   - `plugins/widget-workshop/.claude-plugin/plugin.json`
6. Open a promotion PR from `staging` to `main`.
7. After merge, tag the merge commit: `git tag v0.1.0 && git push origin v0.1.0`.

Do not publish a release from a branch that fails the repository validation script.