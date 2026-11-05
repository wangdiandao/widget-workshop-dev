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

Publish opens the creation form directly. Review the title, description, tags, preview, and visibility; new publications default to Public. Each work has one publication in the drawer’s Publish section. Once submission starts, the original Publish button is disabled; use Update below to open the update form. Update keeps the item ID read-only and accepts optional change notes. If creation has an unknown outcome, recover the original item ID first. Updates preserve the remote title, description, and visibility. There is no operation selector, Save draft, or Remove draft action. Opening or closing a preview creates no publication record. Cards show the upload version beside the work name and Upload complete on success.

New publications start public. Review metadata, preview, tags and actual content using the host workflow. Failure must preserve the usable installation. Service availability, account consent and terms depend on Steam and the environment.

Publish in a layout detail drawer opens creation directly; published layouts use Update below. Layout dialogs list included component names and UUIDs instead of a preview image, upload file list, or raw layout JSON. Select and review shareable configuration values in that same dialog: none are selected for the first publication; submitted records retain the selected fields, and subsequent updates refresh their values. Sharing choices remain available when updating and use only the configuration snapshot validated by the host when preparing the preview. Layout publications and updates do not generate or upload preview images; updates preserve any existing Steam cover. Workshop layouts use the layout library's image-free card style, using the validated downloaded layout.json cache for card and detail resolution before falling back to the remote summary. Resolution is unknown only when neither source is usable. Widget publications continue to use the component preview or the product placeholder.

The host manages layout work versions on save, overwrite and rename. Before upload it checks the remote version and freezes a higher version; retries after failure or uncertainty keep that version and content. Sharing choices are read-only during retries; after a successful upload, another update can change them. Importing a layout with an existing identity creates a separate local copy and preserves the original. Layout details show dependency and compatibility checks without an arrangement diagram.

Shared layouts replace one display, require existing dependencies and do not subscribe automatically. Layouts identify dependencies by component UUID, regardless of local, development or Workshop source. Publishing does not require Workshop component references or rebinding. Never include author source paths or grants. Read [Workshop behavior](../reference/modules/workshop.md) and [layouts](../reference/contracts/layout.md).
