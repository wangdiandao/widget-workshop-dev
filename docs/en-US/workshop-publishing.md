# Workshop Publishing

Steam Workshop publishing starts from the same component source folder used for local validation. Publish only after the package imports cleanly and runs with the final manifest permission category list.

## Publishing Checklist

- Manifest fields are complete and describe the component accurately.
- `displayName`, `description`, `preview`, and `categories` are ready for public browsing.
- The Steam account used for upload is the public Workshop author.
- The component has a readable `.png`, `.jpg`, or `.jpeg` preview image; SVG previews are not supported.
- The component does not depend on machine-local paths.
- Locale files cover the languages declared in `locales.supported`.
- Settings defaults are valid and useful on a fresh install.
- Host API failures degrade cleanly.
- The package follows the Steam Subscriber Agreement and any required EULA or third-party license obligations.

## Category Mapping

Workshop browsing uses the manifest category keys:

| manifest key | Steam Workshop tag |
|---|---|
| `dashboard` | Dashboard |
| `productivity` | Productivity |
| `desktop_personalization` | Desktop Personalization |
| `workflow_integrations` | Workflow Integrations |
| `device_environment` | Device Environment |
| `lifestyle` | Lifestyle |
| missing or empty | Other |

## Before Upload

Run a local import from a clean copy of the component folder. Open the imported component, exercise settings, grant only the requested permission categories, and verify every Host API path the component uses.

After upload, install the Workshop copy and validate that the published package behaves like the local copy.
