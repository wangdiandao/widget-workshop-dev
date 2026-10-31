# Issue-driven maintenance and synchronization

External contributions, including code, documentation, translation and PRs, are not accepted. External users may only open Issues. The owner follows Issue → branch → PR → checks → merge → Pages. CONTRIBUTING.md is the authoritative maintenance policy.

## Change sequence

Associate an open Issue before implementation. Use its number in the branch and a Closes #number line in the PR. Issue policy checks owner authorship, an open same-repository Issue and matching branch number. Validate checks snapshots, plugin structure, examples, types and site build. Merge only after passing checks and verify the Pages deployment.

## Synchronize the host

```powershell
node tools/sync-host.mjs --source 'E:/repos/Widget Workshop'
node tools/sync-host.mjs --source 'E:/repos/Widget Workshop' --check
npm run check
npm run docs:build
```

The tool synchronizes selected contracts/modules, SDK declarations/protocol and five host examples. host-snapshot.json records relative source paths and SHA-256 values. Generated Chinese references only adapt site links and source labels. English references, tutorials, recipes and Skills require semantic review; synchronization does not translate them.

Author-visible changes to host rules, APIs, lifecycle, behavior or publishing must update this repository in the same delivery. Pure internal refactoring may be marked not applicable with a reason. Correct generated material at the host source first.

## Build and deployment

VitePress reads docs and outputs docs/.vitepress/dist using the fixed repository base. Node.js 22 and package-lock.json define the build. Main deploys using GitHub Actions Pages; PR checks do not deploy. Build output is not committed.

Consult current official documentation when changing build/hosting APIs. Record dependency overrides, untested runtime paths and deployment failures. A local build does not establish a live deployment.
