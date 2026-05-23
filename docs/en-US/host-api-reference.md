# Host API Reference

Component pages call host capabilities through `window.widgetWorkshop`:

```js
const value = await window.widgetWorkshop.<category>.<method>(...args);
```

Every method returns a `Promise`. On failure, the Promise rejects with an `Error`; `error.code` contains the host error code.

## Permission Rules

A component must declare every category it uses in `manifest.json` under `permissions`. Unless noted otherwise, protected categories also require the user to grant that category on the component settings page.

Always available methods:

- `app.getLocaleInfo()`
- `host.getComponentContext()`
- `host.getComponentSettings()`
- `host.getRuntimeInfo()`
- `host.getPermissionGrants()`

Methods that only require the manifest to declare `shell`, without the normal shell grant toggle:

- `shell.launchConfiguredFile(path)`
- `shell.getConfiguredFileIcon(path)`

Those two methods also require `path` to be an absolute file path saved by a `file` field in the current component settings schema. Component pages cannot write those settings through Host API; mutable component data belongs in `storage.*`.

Common error codes:

- `PermissionDenied`: the category is undeclared or ungranted, or the file token / configured file does not belong to the current component.
- `MethodNotFound`: the category or method does not exist.
- `InvalidArguments`: the argument type, count, or value is invalid.
- `NotFound`: the target file, directory, or token does not exist.
- `PackageFileBlocked`: `shell.openPackageFile` blocked an executable or active script package file type.
- `LaunchFailed`: `shell.launchConfiguredFile` failed to launch the target.
- `StorageQuotaExceeded`: component-private storage exceeded 1 MiB.
- `FileTooLarge`: a token file read exceeded 1 MiB.
- `FetchBlocked`, `FetchTimeout`, `FetchTooLarge`, `FetchNetworkError`: `fetch.request` security, timeout, size, or network errors.
- `HostApiError`: the host failed while handling the call without exposing internal details.

## Type Contract

Object field names are case-sensitive. Unless noted otherwise, memory values are KiB, time durations are seconds, and timestamps are UTC ISO 8601 strings.

```ts
type LocaleInfo = { locale: string; systemLocale: string; language: string };
type AppInfo = { name: "WidgetWorkshop"; version: string; platform: "windows"; isPackaged: boolean; startedAt: string; singleInstance: boolean };
type PermissionGrants = Record<string, boolean>;

type Layout = { monitorId: string; x: number; y: number; width: number; height: number; dpi: number; zOrder: number };
type ComponentContext = { packageId: string; componentId: string; displayName: string; version: string; source: string; permissions: string[] };
type ComponentState = { enabled: boolean; locked: boolean; hidden: boolean; layout: Layout };
type RuntimeInfo = { performanceMode: string; displayAction: string; displayPolicies: Record<string, string>; runningComponentCount: number; availablePackageCount: number };

type CpuUsage = { percentCPUUsage: number; cumulativeCPUUsage: number };
type ProcessMemoryInfo = { residentSet: number; private: number; shared: 0 };
type WebViewMemoryInfo = { hostWorkingSet: number; webViewWorkingSet: number; totalWorkingSet: number; webViewProcessCount: number; runningControllerCount: number };
type VersionsInfo = { dotnet: string; os: string; webView2: "shared" };
type PlatformInfo = { platform: "win32"; os: string; architecture: string };
type EnvironmentInfo = { processorCount: number; is64BitOperatingSystem: boolean; machineName: string };
type NetworkInfo = { name: string; type: string; bytesReceived: number; bytesSent: number };
type DiskInfo = { name: string; totalBytes: number; freeBytes: number; format: string };
type SystemMemoryInfo = { total: number; free: number; swapTotal: number; swapFree: number };

type Point = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };
type Display = { id: string; bounds: Rect; workArea: Rect; scaleFactor: number; rotation: number; primary: boolean };

type ThemeInfo = { themeSource: "system"; shouldUseDarkColors: boolean; shouldUseHighContrastColors: boolean; shouldUseInvertedColorScheme: boolean; inForcedColorsMode: boolean; shouldReduceMotion: boolean };
type SystemColors = { accent: string; window: string; windowText: string };
type PowerInfo = { acLineStatus: "online" | "offline" | "unknown"; battery: { state: string; percent: number | null } };
type DisplayPowerState = { sleeping: boolean };

type ShellResult = { success: boolean };
type ConfiguredFileIcon = { name: string; iconDataUri: string | null };
type MessageBoxOptions = { message?: string; title?: string; buttons?: string[] };
type MessageBoxResult = { response: number; button: string | null; canceled: boolean; checkboxChecked: false };
type FilePickerOptions = { extensions?: string[]; suggestedName?: string };
type FileMetadata = { token: string; name: string; sizeBytes: number };
type OpenFilePickerResult = { canceled: boolean; files: FileMetadata[] };
type SaveFilePickerResult = { canceled: boolean; file: FileMetadata | null };
type StorageQuotaInfo = { usedBytes: number; quotaBytes: 1048576 };
type FetchOptions = { url: string; method?: "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE"; headers?: Record<string, string>; body?: string; bodyBase64?: string; responseType?: "text" | "base64" };
type FetchTextResponse = { ok: boolean; status: number; statusText: string; url: string; headers: Record<string, string>; bodyText: string };
type FetchBase64Response = { ok: boolean; status: number; statusText: string; url: string; headers: Record<string, string>; bodyBase64: string };

type WidgetWorkshopAppApi = {
  getInfo(): Promise<AppInfo>;
  getLocaleInfo(): Promise<LocaleInfo>;
  getPreferredLanguages(): Promise<string[]>;
};

type WidgetWorkshopHostApi = {
  getRuntimeInfo(): Promise<RuntimeInfo>;
  getComponentState(): Promise<ComponentState>;
  getComponentSettings(): Promise<Record<string, unknown>>;
  getComponentContext(): Promise<ComponentContext>;
  getPermissionGrants(): Promise<PermissionGrants>;
};

type WidgetWorkshopProcessApi = {
  getCpuUsage(): Promise<CpuUsage>;
  getHostMemoryInfo(): Promise<ProcessMemoryInfo>;
  getWebViewMemoryInfo(): Promise<WebViewMemoryInfo>;
  getCreationTime(): Promise<string>;
  uptime(): Promise<number>;
  getVersions(): Promise<VersionsInfo>;
};

type WidgetWorkshopSystemApi = {
  getPlatformInfo(): Promise<PlatformInfo>;
  getOsVersion(): Promise<string>;
  getArchitecture(): Promise<string>;
  getEnvironmentInfo(): Promise<EnvironmentInfo>;
  getNetworkInfo(): Promise<NetworkInfo[]>;
  getDiskInfo(): Promise<DiskInfo[]>;
  getMemoryInfo(): Promise<SystemMemoryInfo>;
};

type WidgetWorkshopScreenApi = {
  getPrimaryDisplay(): Promise<Display>;
  getAllDisplays(): Promise<Display[]>;
  getCursorScreenPoint(): Promise<Point>;
  getDisplayNearestPoint(point: Point): Promise<Display>;
  getDisplayMatching(rect: Rect): Promise<Display>;
  screenToDipPoint(point: Point): Promise<Point>;
  dipToScreenPoint(point: Point): Promise<Point>;
};

type WidgetWorkshopThemeApi = {
  getThemeInfo(): Promise<ThemeInfo>;
  getSystemColors(): Promise<SystemColors>;
};

type WidgetWorkshopPowerApi = {
  getPowerInfo(): Promise<PowerInfo>;
  getSystemIdleTime(): Promise<number>;
  getDisplayPowerState(): Promise<DisplayPowerState>;
};

type WidgetWorkshopShellApi = {
  openExternal(url: string): Promise<ShellResult>;
  openPackageFile(path: string): Promise<ShellResult>;
  showPackageItemInFolder(path: string): Promise<{ success: true }>;
  launchConfiguredFile(path: string): Promise<{ success: true }>;
  getConfiguredFileIcon(path: string): Promise<ConfiguredFileIcon>;
};

type WidgetWorkshopDialogApi = {
  showOpenFilePicker(options?: FilePickerOptions): Promise<OpenFilePickerResult>;
  showSaveFilePicker(options?: FilePickerOptions): Promise<SaveFilePickerResult>;
  showMessageBox(options?: MessageBoxOptions): Promise<MessageBoxResult>;
};

type WidgetWorkshopClipboardApi = {
  readText(): Promise<string>;
  writeText(text: string): Promise<{ success: true }>;
  readHtml(): Promise<string>;
  writeHtml(html: string): Promise<{ success: true }>;
};

type WidgetWorkshopStorageApi = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<{ success: true }>;
  removeItem(key: string): Promise<{ success: true }>;
  clear(): Promise<{ success: true }>;
  getQuotaInfo(): Promise<StorageQuotaInfo>;
};

type WidgetWorkshopFilesApi = {
  readText(token: string): Promise<string>;
  writeText(token: string, text: string): Promise<{ success: true }>;
  readBase64(token: string): Promise<string>;
  writeBase64(token: string, bodyBase64: string): Promise<{ success: true }>;
  getMetadata(token: string): Promise<FileMetadata>;
  release(token: string): Promise<{ released: true }>;
};

type WidgetWorkshopFetchApi = {
  request(options: FetchOptions): Promise<FetchTextResponse | FetchBase64Response>;
};

type WidgetWorkshopApi = {
  app: WidgetWorkshopAppApi;
  host: WidgetWorkshopHostApi;
  process: WidgetWorkshopProcessApi;
  system: WidgetWorkshopSystemApi;
  screen: WidgetWorkshopScreenApi;
  theme: WidgetWorkshopThemeApi;
  power: WidgetWorkshopPowerApi;
  shell: WidgetWorkshopShellApi;
  dialog: WidgetWorkshopDialogApi;
  clipboard: WidgetWorkshopClipboardApi;
  storage: WidgetWorkshopStorageApi;
  files: WidgetWorkshopFilesApi;
  fetch: WidgetWorkshopFetchApi;
};
```

`screen` is a permission category and API namespace, not a return type.

## API Summary

| API | Purpose | Parameters | Returns |
| --- | --- | --- | --- |
| `app.getInfo()` | Reads host app information. | None | `AppInfo` |
| `app.getLocaleInfo()` | Reads the current host locale. Always available. | None | `LocaleInfo` |
| `app.getPreferredLanguages()` | Reads preferred host UI languages. | None | `string[]` |
| `host.getRuntimeInfo()` | Reads runtime mode, display action, display policies, and counts. Always available. | None | `RuntimeInfo` |
| `host.getComponentState()` | Reads enabled, locked, hidden, and layout state. | None | `ComponentState` |
| `host.getComponentSettings()` | Reads user-owned saved component settings. Always available. | None | `Record<string, unknown>` |
| `host.getComponentContext()` | Reads component identity and manifest context. Always available. | None | `ComponentContext` |
| `host.getPermissionGrants()` | Reads current grants for declared categories. Always available. | None | `PermissionGrants` |
| `process.getCpuUsage()` | Reads host process CPU usage. | None | `CpuUsage` |
| `process.getHostMemoryInfo()` | Reads host process memory. | None | `ProcessMemoryInfo` |
| `process.getWebViewMemoryInfo()` | Reads shared WebView memory. | None | `WebViewMemoryInfo` |
| `process.getCreationTime()` | Reads host process creation time. | None | `string` |
| `process.uptime()` | Reads host process uptime in seconds. | None | `number` |
| `process.getVersions()` | Reads runtime versions. | None | `VersionsInfo` |
| `system.getPlatformInfo()` | Reads OS platform summary. | None | `PlatformInfo` |
| `system.getOsVersion()` | Reads the operating system version string. | None | `string` |
| `system.getArchitecture()` | Reads OS architecture. | None | `string` |
| `system.getEnvironmentInfo()` | Reads environment summary. | None | `EnvironmentInfo` |
| `system.getNetworkInfo()` | Reads active adapter traffic summaries. | None | `NetworkInfo[]` |
| `system.getDiskInfo()` | Reads drive summaries. | None | `DiskInfo[]` |
| `system.getMemoryInfo()` | Reads physical memory and page file summary. | None | `SystemMemoryInfo` |
| `screen.getPrimaryDisplay()` | Reads the primary display. | None | `Display` |
| `screen.getAllDisplays()` | Reads all displays. | None | `Display[]` |
| `screen.getCursorScreenPoint()` | Reads current cursor position. | None | `Point` |
| `screen.getDisplayNearestPoint(point)` | Finds the display nearest a point. | `point: Point` | `Display` |
| `screen.getDisplayMatching(rect)` | Finds the display matching a rectangle. | `rect: Rect` | `Display` |
| `screen.screenToDipPoint(point)` | Converts screen pixels to DIP. | `point: Point` | `Point` |
| `screen.dipToScreenPoint(point)` | Converts DIP to screen pixels. | `point: Point` | `Point` |
| `theme.getThemeInfo()` | Reads theme and display preferences. | None | `ThemeInfo` |
| `theme.getSystemColors()` | Reads basic system colors. | None | `SystemColors` |
| `power.getPowerInfo()` | Reads AC and battery summary. | None | `PowerInfo` |
| `power.getSystemIdleTime()` | Reads seconds since last user input. | None | `number` |
| `power.getDisplayPowerState()` | Reads display sleeping state. | None | `DisplayPowerState` |
| `shell.openExternal(url)` | Opens `http`, `https`, or `mailto` URLs. | `url: string` | `ShellResult` |
| `shell.openPackageFile(path)` | Opens a passive package-relative file. | `path: string` | `ShellResult` |
| `shell.showPackageItemInFolder(path)` | Reveals a package file or directory. | `path: string` | `{ success: true }` |
| `shell.launchConfiguredFile(path)` | Launches a user-saved file setting path. | `path: string` | `{ success: true }` |
| `shell.getConfiguredFileIcon(path)` | Reads a user-saved file setting icon. | `path: string` | `ConfiguredFileIcon` |
| `dialog.showOpenFilePicker(options)` | Opens a file picker and returns token metadata. | `options?: FilePickerOptions` | `OpenFilePickerResult` |
| `dialog.showSaveFilePicker(options)` | Opens a save picker and returns token metadata. | `options?: FilePickerOptions` | `SaveFilePickerResult` |
| `dialog.showMessageBox(options)` | Shows a host message box. | `options?: MessageBoxOptions` | `MessageBoxResult` |
| `clipboard.readText()` | Reads clipboard text. | None | `string` |
| `clipboard.writeText(text)` | Writes clipboard text. | `text: string` | `{ success: true }` |
| `clipboard.readHtml()` | Reads clipboard HTML. | None | `string` |
| `clipboard.writeHtml(html)` | Writes clipboard HTML. | `html: string` | `{ success: true }` |
| `storage.getItem(key)` | Reads component-private storage. | `key: string` | `string \| null` |
| `storage.setItem(key, value)` | Writes component-private storage. | `key: string, value: string` | `{ success: true }` |
| `storage.removeItem(key)` | Removes storage value. | `key: string` | `{ success: true }` |
| `storage.clear()` | Clears component storage. | None | `{ success: true }` |
| `storage.getQuotaInfo()` | Reads storage quota usage. | None | `StorageQuotaInfo` |
| `files.readText(token)` | Reads a token file as UTF-8. | `token: string` | `string` |
| `files.writeText(token, text)` | Writes UTF-8 to a token file. | `token: string, text: string` | `{ success: true }` |
| `files.readBase64(token)` | Reads a token file as base64. | `token: string` | `string` |
| `files.writeBase64(token, bodyBase64)` | Writes base64 to a token file. | `token: string, bodyBase64: string` | `{ success: true }` |
| `files.getMetadata(token)` | Reads token metadata. | `token: string` | `FileMetadata` |
| `files.release(token)` | Releases a token. | `token: string` | `{ released: true }` |
| `fetch.request(options)` | Requests a public HTTPS URL through the host. | `options: FetchOptions` | `FetchTextResponse \| FetchBase64Response` |

`files.readText(token)` and `files.readBase64(token)` reject files larger than 1 MiB. `fetch.request` does not use browser cookies, does not allow proxy credentials, blocks localhost/private/reserved targets, limits response bodies to 1 MiB, times out after 10 seconds, and follows up to 3 redirects.
