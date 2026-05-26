---
name: widget-workshop-code-review
description: Use when reviewing Widget Workshop component packages, manifests, settings, Host API usage, permissions, localization, preview assets, security, graceful degradation, or Workshop-readiness.
---

# Widget Workshop Code Review

## Overview

Review component packages against the public Widget Workshop contract and the redesigned creator-facing docs. Lead with concrete bugs and release blockers, not preferences.

## Review Order

1. Run `scripts/Test-ComponentPackage.ps1` against the component source folder, not an installed runtime copy.
2. Read `manifest.json` for identity, preview, window size, categories, permissions, locales, and `hasCustomSettings`.
3. If settings are enabled, review `scripts/settings.json` and every field-level `default`.
4. Search component code for `window.widgetWorkshop` and compare calls to `contracts/host-api.d.ts`.
5. Check `locales.enable` behavior: disabled or missing locales keep text in `index.html`; enabled locales require matching files and title fallback.
6. Check that each permission category is necessary for visible behavior.
7. Check denied-permission behavior with `host.getPermissionGrants()` or `try`/`catch`.
8. Check preview asset suitability, drag area bounds, and Workshop metadata readiness.

## Findings Format

Start with findings ordered by severity. Include the file path, the violated contract, and the user-visible impact. If no issues are found, say so and list any verification gaps.

Use this shape:

```text
Findings
- [P1] path:line - Problem and impact.

Open Questions
- Any unresolved product or contract decision.

Verification
- Command run and result.
```

## Review Checklist

- `manifest.json` has no removed fields and no unsupported paths.
- `categories` and `permissions` use accepted keys and no duplicates.
- Settings schema field defaults match field types, controls, options, and file extension rules.
- Locale files exist only when the manifest enables or implies localization.
- Runtime code does not assume all permissions are granted.
- `fetch`, `files`, `shell`, `clipboard`, `system`, `screen`, `process`, `theme`, and `power` usage is justified by component behavior.
- File flows pass tokens to `files.*`, not raw paths.
- Public sharing metadata has a useful description, preview, categories, locales, defaults, and permission list.

## Boundaries

- Do not require Steam upload to complete a code review.
- Do not ask creators to run app publish commands, SteamPipe scripts, or host-source tests.
- Do not report personal style preferences as blockers.
