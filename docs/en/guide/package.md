# Projects and runnable packages

An authoring project may contain source files, dependencies and build tools. Users receive a built static directory and do not install Node.js or run author install/build commands.

## Package boundary

Include manifest.json and the local HTML referenced by entry, defaulting to index.html. A missing implicit preview.png uses a placeholder; an explicitly declared PNG must exist. Resources use safe package-relative paths, without traversal, absolute paths, links or remote scripts.

window declares initial/minimum dimensions, initial layer and surface. Opaque is the default. Transparent work must explicitly handle native input mode and recovery; CSS cannot implement native click-through. Authors control size through the manifest and window.setSize; layouts do not override author size.

## Frontend tooling and types

Build locally resolvable assets and copy the manifest into the final directory. Bind that runnable output directory on the Development page. A development server URL is not a component package.

Use docs/public/sdk/widget-host.d.ts outside the package for editor/compiler types. TypeScript uses ES2020, DOM, strict and noEmit; do not conceal declaration problems with skipLibCheck. Confirm that the final package contains none of the three SDK filenames.

## Copies, reloads and identity

The host runs a validated immutable copy, not the author directory directly. Development reloads use content hashes, allowing the declared version to stay unchanged; invalid input preserves the last successful version. Formal versions use three nonnegative integers.

Ordinary local import does not watch source files or offer directory updates. Add a development component explicitly; use Relocate after moving the directory and keep widgetId unchanged. Removing development installation preserves author source but cleans installation-owned data.

See [the package contract](../reference/contracts/component.md) for exact fields, path and size budgets, and [development behavior](../reference/modules/development.md) for reloads and draft protection.
