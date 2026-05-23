---
name: widget-workshop-host-api
description: "Widget Workshop Host API guidance. Use when implementing or reviewing window.widgetWorkshop calls, permission category declarations, fetch, storage, clipboard, dialog/files token flow, shell operations, runtime state, system/process/screen/theme/power APIs, or Host API error handling."
---

# Widget Workshop Host API

## Start Here

Read `contracts/host-api.d.ts` and then `docs/en-US/host-api-reference.md` or `docs/zh-CN/host-api-reference.md` before writing component Host API code.

## Type Contracts

When writing or reviewing Host API calls, make every parameter and return value traceable to a named shape. `screen` is a permission category and API namespace, not a return type.

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

`window.widgetWorkshop.screen` implements `WidgetWorkshopScreenApi`; coordinate arguments use `Point` or `Rect`, and display information returns `Display`.

## Rules

- Call methods through `window.widgetWorkshop`.
- Treat every method as asynchronous.
- Wrap calls in `try`/`catch`.
- Do not invent categories or methods. If the developer docs do not list a method, treat it as unavailable for component creators.
- Manifest `permissions` declare permission category values only.
- Use `app.getLocaleInfo()` for locale; it is always available.
- Use `host.getPermissionGrants()` to decide degraded UI for optional capabilities.
- Use `storage.*` for component-private mutable data; component pages cannot save host-owned settings.
- Handle `PermissionDenied`, `MethodNotFound`, `InvalidArguments`, and `HostApiError`.

## Sensitive Flows

- Use `fetch.request` only for public HTTPS data requests.
- Use `dialog.showOpenFilePicker(options)` before `files.readText(token)`.
- Use `files.release(token)` when a token is no longer needed.
- File token metadata never exposes absolute paths.
- Use `shell.openPackageFile(path)` only with package-relative paths.
- Use configured-file shell methods only for paths stored in this component's file settings by the host settings UI.

## Creator Boundary

- Use developer docs as the creator-facing API contract.
- Do not ask component creators to inspect Widget Workshop host source for normal API usage.
- Do not direct creators to repository tests or publish scripts for Host API validation.
