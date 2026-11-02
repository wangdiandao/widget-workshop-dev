# Validation and publishing

Deliver a static component directory, not a Git checkout, dependency tree or user-data snapshot. Current local import accepts directories, not ZIP packages.

## Before release

1. Include the manifest, HTML, local scripts/styles/assets and optional PNG preview. Exclude SDK files, secrets, personal content, logs and remote JavaScript.
2. Keep a stable `widgetId`; formal versions use three nonnegative integers. Names are display text rather than identity. New works need new UUIDs.
3. Run the host's Check Component Package and enable the widget. Test main behavior, denial, revocation, visibility, reload and failure recovery. Pets need native hit testing and recovery; games need save conflicts; feeds need network failure and stale-result handling.
4. Review `shareable` configuration. Secrets, directory grants, credentials, temporary IDs and progress do not belong in a shared layout or package.

## Workshop workflow

The GitHub icon beside the Development page title opens the [widget-workshop-dev repository](https://github.com/wangdiandao/widget-workshop-dev).

Use Publish in the selected development component's detail drawer. The host validates current source and prepares a clean upload copy. Source `widgetId` must still match the component; publication need not activate the source and does not replace the running version.

In Preview and publish, choose Publish or Update. Publish shows the work title, description, tags, preview, and visibility; the labeled preview sits between tags and visibility, and new publications default to Public. Update only asks for your item ID and optional change notes, preserving the existing Workshop title, description, and visibility. Saving an update draft preserves its item ID and change notes; linked targets are read-only. If creation has an unknown outcome, recover the original item ID and update it to avoid duplicates. Draft cards show the prepared upload version beside the work name and use a concise Upload complete status.

New publications start public. Review metadata, preview, tags and actual content using the host workflow. Failure must preserve the usable installation. Service availability, account consent and terms depend on Steam and the environment.

Publish in a layout detail drawer opens the same dialog directly, with a Publish/Update selector. Layout dialogs list included component names and UUIDs instead of a preview image, upload file list, or raw layout JSON. Select and review shareable configuration values in that same dialog: none are selected for a new draft, and saved drafts retain the selection. Sharing choices remain available when updating and use only the configuration snapshot validated by the host when preparing the draft.

Shared layouts replace one display, require existing dependencies and do not subscribe automatically. Layouts identify dependencies by component UUID, regardless of local, development or Workshop source. Publishing does not require Workshop component references or rebinding. Never include author source paths or grants. Read [Workshop behavior](../reference/modules/workshop.md) and [layouts](../reference/contracts/layout.md).
