# Component-owned login

A component implements the provider-supported login, consent, token refresh and logout through networking. Generic credentials can protect component-owned values at rest, while user secret bindings remain separate references. Tokens may also stay memory-only when that is the chosen policy. Never embed credentials in packages, shared configuration or logs. The host example's provider flow is not proof every third-party service permits the same flow.

## Sources and author guidance

Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration.
