# Media remote

Read the current media session, supported controls and artwork before issuing a finite command. Revalidate session identity when state changes; no session, missing artwork and unsupported commands are normal states. The host does not expose arbitrary app control. Media state is a base interface, not a manifest capability. Author polling stays bounded and cancellable, stale results do not update old documents, and artwork needs an unavailable placeholder.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/media.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.
