# Workshop Publishing

Steam Workshop publishing uses the same local component source folder. Prepare a public upload only after the package imports cleanly and runs with the final permissions and settings.

## Pre-Publish Checklist

- Manifest fields are complete, and `displayName`, `description`, `preview`, and `categories` are suitable for public browsing.
- The preview image is clear, square or nearly square, and uses `.png`, `.jpg`, or `.jpeg`.
- The package does not depend on local absolute paths from the development machine.
- When localization is enabled, locale files cover `locales.supported`; when it is disabled, public text comes from `displayName`, `description`, and `index.html`.
- Settings defaults are useful on a fresh install.
- The component degrades cleanly when Host API calls fail.
- Permission declarations match actual capabilities and do not request unrelated categories.
- Package content follows the Steam Subscriber Agreement, EULA requirements, and third-party license obligations.

## Category Mapping

Workshop browsing uses manifest category keys:

| manifest key | Workshop tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| missing or empty | Other |

## Before Upload

Import once from a clean copy of the component folder. Open the imported component, exercise settings, grant only the final manifest permission categories, and verify every Host API path the component actually uses.

After upload, install the Workshop copy and confirm the public package behaves the same as the local package.

Workshop author identity comes from the uploading Steam account, not from a manifest field.
