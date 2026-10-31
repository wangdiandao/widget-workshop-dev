# Domain glossary

| Term | Meaning |
| --- | --- |
| Component / Widget | An authored web work, not a single window |
| Widget Package | One version's manifest, entry and local assets; excludes personal data |
| Installed Widget | Source-specific installation that owns grants, update and removal |
| Development Widget | Explicitly added development installation with a local source binding |
| Widget Instance | An installation on one physical display; at most one per display |
| Enabled Intent | Persistent user choice to run, retained through disconnect or temporary failure |
| Visibility | Show/hide preference, separate from enablement; hidden may continue running |
| Display | Physical output target with stable host identity, not connection order |
| Windows Virtual Desktop | Windows task-view workspace; no separate layout support is promised |
| Layout | One display's arrangement, enable/visibility/mute and configuration |
| Restore Snapshot | Recoverable arrangement/configuration, without restored authorization |
| Workshop Item | Subscribeable component or layout; subscription is not installation |
| Capability | One of six optional grant contracts; declaration is not authorization |
| Grant | Installation-wide user permission for an optional capability |
| Resource Binding | User-selected directory, launch target or secret reference, not arbitrary author path |
| Configuration Field | Author-declared setting stored in the display's layout entry |
| Installation Save | Persistent progress shared by every instance of an installation |
| Collaboration Message | Temporary latest-value hint; not durable save, history or permission |

See [data ownership](../guide/data.md) and [contracts](index.md).
