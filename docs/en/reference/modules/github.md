# Component-owned login

The host has no dedicated GitHub or other provider authorization/account API. A component implements the provider-supported login, consent, token refresh and logout through networking. Generic credentials can protect component-owned values at rest, while user secret bindings remain separate references. Tokens may also stay memory-only when that is the chosen policy. Never embed credentials in packages, shared configuration or logs. The host example's provider flow is not proof every third-party service permits the same flow.

## Sources and author guidance

The [synchronized source-language module](../../../reference/modules/github.md) retains the host wording. Read the [local development lessons](../../guide/lessons.md), [recipes](../../recipes/index.md) and [exact SDK declarations](../types.md) before implementing an integration. Do not interpret this source summary as a claim that all runtime/device paths were retested.
