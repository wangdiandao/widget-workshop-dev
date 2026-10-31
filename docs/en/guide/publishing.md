# Validation and publishing

Deliver a static component directory, not a Git checkout, dependency tree or user-data snapshot. Current local import accepts directories, not ZIP packages.

## Before release

1. Include the manifest, HTML, local scripts/styles/assets and optional PNG preview. Exclude SDK files, secrets, personal content, logs and remote JavaScript.
2. Keep a stable widgetId; formal versions use three nonnegative integers. Names are display text rather than identity. New works need new UUIDs.
3. Run the host's Check Component Package and enable the widget. Test main behavior, denial, revocation, visibility, reload and failure recovery. Pets need native hit testing and recovery; games need save conflicts; feeds need network failure and stale-result handling.
4. Review shareable configuration. Secrets, directory grants, credentials, temporary IDs and progress do not belong in a shared layout or package.

## Workshop workflow

Use Publish to Workshop in the selected development component's detail drawer. The host validates current source and prepares a clean upload copy. Source widgetId must still match the component; publication need not activate the source and does not replace the running version.

Uploads start private. Review metadata, preview, tags and actual content using the host workflow. Failure must preserve the usable installation. Service availability, account consent and terms depend on Steam and the environment.

Shared layouts replace one display, require existing dependencies and do not subscribe automatically. Local layouts may reference development identities; Workshop layouts must reference formal Workshop works. Never include author source paths or grants. Read [Workshop behavior](../reference/modules/workshop.md) and [layouts](../reference/contracts/layout.md).

## Verification limits

npm run check verifies snapshots, references, metadata, basic example fields, JS syntax and SDK types. npm run docs:build verifies the documentation build. Neither replaces strict host package validation, actual WebView behavior, Steam upload, physical input, multiple displays or system-device testing.
