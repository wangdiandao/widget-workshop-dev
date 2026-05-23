# Host API 参考

组件页面通过 `window.widgetWorkshop` 调用宿主能力：

```js
const value = await window.widgetWorkshop.<category>.<method>(...args);
```

所有方法都返回 `Promise`。失败时 Promise reject 一个 `Error`，`error.code` 是宿主错误码。

## 权限规则

组件必须在 `manifest.json` 的 `permissions` 中声明要使用的 category。除特别说明外，受保护 category 还需要用户在组件设置页授予该 category。

始终可用的方法：

- `app.getLocaleInfo()`
- `host.getComponentContext()`
- `host.getComponentSettings()`
- `host.getRuntimeInfo()`
- `host.getPermissionGrants()`

只要求 manifest 声明 `shell`，不要求普通 shell 授权开关的方法：

- `shell.launchConfiguredFile(path)`
- `shell.getConfiguredFileIcon(path)`

这两个方法还要求 `path` 是当前组件 settings schema 中 `file` 字段保存过的绝对文件路径。组件页面不能通过 Host API 写入这些 settings；组件运行时可变数据应使用 `storage.*`。

常见错误码：

- `PermissionDenied`：category 未声明、未授权，或文件 token / configured file 不属于当前组件。
- `MethodNotFound`：category 或 method 不存在。
- `InvalidArguments`：参数类型、数量或取值不符合要求。
- `NotFound`：目标文件、目录或 token 不存在。
- `PackageFileBlocked`：`shell.openPackageFile` 阻止打开可执行或主动脚本类包内文件。
- `LaunchFailed`：`shell.launchConfiguredFile` 启动失败。
- `StorageQuotaExceeded`：组件私有 storage 超过 1 MiB。
- `FileTooLarge`：token 文件读取超过 1 MiB。
- `FetchBlocked`、`FetchTimeout`、`FetchTooLarge`、`FetchNetworkError`：`fetch.request` 的网络安全、超时、大小或网络错误。
- `HostApiError`：宿主处理调用时发生未公开的内部错误。

## 类型契约

对象字段名区分大小写。未特别说明时，内存为 KiB，时间为秒，时间戳为 UTC ISO 8601 字符串。

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

`screen` 是 permission category 和 API namespace，不是返回值类型。

## 接口摘要

| 接口 | 用途 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `app.getInfo()` | 获取宿主应用信息。 | 无 | `AppInfo` |
| `app.getLocaleInfo()` | 获取宿主当前语言环境，始终可用。 | 无 | `LocaleInfo` |
| `app.getPreferredLanguages()` | 获取宿主偏好的 UI 语言。 | 无 | `string[]` |
| `host.getRuntimeInfo()` | 获取运行模式、显示策略和组件数量，始终可用。 | 无 | `RuntimeInfo` |
| `host.getComponentState()` | 获取启用、锁定、隐藏和布局状态。 | 无 | `ComponentState` |
| `host.getComponentSettings()` | 读取用户拥有的组件 settings，始终可用。 | 无 | `Record<string, unknown>` |
| `host.getComponentContext()` | 获取组件身份与 manifest 上下文，始终可用。 | 无 | `ComponentContext` |
| `host.getPermissionGrants()` | 获取已声明 category 的当前授权状态，始终可用。 | 无 | `PermissionGrants` |
| `process.getCpuUsage()` | 获取宿主进程 CPU 使用情况。 | 无 | `CpuUsage` |
| `process.getHostMemoryInfo()` | 获取宿主进程内存。 | 无 | `ProcessMemoryInfo` |
| `process.getWebViewMemoryInfo()` | 获取共享 WebView 内存。 | 无 | `WebViewMemoryInfo` |
| `process.getCreationTime()` | 获取宿主进程创建时间。 | 无 | `string` |
| `process.uptime()` | 获取宿主进程运行秒数。 | 无 | `number` |
| `process.getVersions()` | 获取运行时版本。 | 无 | `VersionsInfo` |
| `system.getPlatformInfo()` | 获取 OS 平台摘要。 | 无 | `PlatformInfo` |
| `system.getOsVersion()` | 获取操作系统版本字符串。 | 无 | `string` |
| `system.getArchitecture()` | 获取 OS 架构。 | 无 | `string` |
| `system.getEnvironmentInfo()` | 获取运行环境摘要。 | 无 | `EnvironmentInfo` |
| `system.getNetworkInfo()` | 获取活动网络适配器流量摘要。 | 无 | `NetworkInfo[]` |
| `system.getDiskInfo()` | 获取磁盘摘要。 | 无 | `DiskInfo[]` |
| `system.getMemoryInfo()` | 获取物理内存和分页文件摘要。 | 无 | `SystemMemoryInfo` |
| `screen.getPrimaryDisplay()` | 获取主显示器。 | 无 | `Display` |
| `screen.getAllDisplays()` | 获取所有显示器。 | 无 | `Display[]` |
| `screen.getCursorScreenPoint()` | 获取鼠标当前位置。 | 无 | `Point` |
| `screen.getDisplayNearestPoint(point)` | 获取离指定点最近的显示器。 | `point: Point` | `Display` |
| `screen.getDisplayMatching(rect)` | 获取匹配指定矩形的显示器。 | `rect: Rect` | `Display` |
| `screen.screenToDipPoint(point)` | 屏幕像素坐标转 DIP。 | `point: Point` | `Point` |
| `screen.dipToScreenPoint(point)` | DIP 坐标转屏幕像素。 | `point: Point` | `Point` |
| `theme.getThemeInfo()` | 获取主题和显示偏好。 | 无 | `ThemeInfo` |
| `theme.getSystemColors()` | 获取基础系统颜色。 | 无 | `SystemColors` |
| `power.getPowerInfo()` | 获取 AC 和电池摘要。 | 无 | `PowerInfo` |
| `power.getSystemIdleTime()` | 获取最后一次用户输入后的秒数。 | 无 | `number` |
| `power.getDisplayPowerState()` | 获取显示器睡眠状态。 | 无 | `DisplayPowerState` |
| `shell.openExternal(url)` | 打开 `http`、`https` 或 `mailto` URL。 | `url: string` | `ShellResult` |
| `shell.openPackageFile(path)` | 打开被动包内相对文件。 | `path: string` | `ShellResult` |
| `shell.showPackageItemInFolder(path)` | 在资源管理器中显示包内文件或目录。 | `path: string` | `{ success: true }` |
| `shell.launchConfiguredFile(path)` | 启动用户保存的 file setting 路径。 | `path: string` | `{ success: true }` |
| `shell.getConfiguredFileIcon(path)` | 读取用户保存的 file setting 图标。 | `path: string` | `ConfiguredFileIcon` |
| `dialog.showOpenFilePicker(options)` | 打开文件选择器并返回 token 元数据。 | `options?: FilePickerOptions` | `OpenFilePickerResult` |
| `dialog.showSaveFilePicker(options)` | 打开保存选择器并返回 token 元数据。 | `options?: FilePickerOptions` | `SaveFilePickerResult` |
| `dialog.showMessageBox(options)` | 显示宿主消息框。 | `options?: MessageBoxOptions` | `MessageBoxResult` |
| `clipboard.readText()` | 读取剪贴板文本。 | 无 | `string` |
| `clipboard.writeText(text)` | 写入剪贴板文本。 | `text: string` | `{ success: true }` |
| `clipboard.readHtml()` | 读取剪贴板 HTML。 | 无 | `string` |
| `clipboard.writeHtml(html)` | 写入剪贴板 HTML。 | `html: string` | `{ success: true }` |
| `storage.getItem(key)` | 读取组件私有 storage。 | `key: string` | `string \| null` |
| `storage.setItem(key, value)` | 写入组件私有 storage。 | `key: string, value: string` | `{ success: true }` |
| `storage.removeItem(key)` | 删除 storage 值。 | `key: string` | `{ success: true }` |
| `storage.clear()` | 清空组件 storage。 | 无 | `{ success: true }` |
| `storage.getQuotaInfo()` | 获取 storage 容量。 | 无 | `StorageQuotaInfo` |
| `files.readText(token)` | 以 UTF-8 读取 token 文件。 | `token: string` | `string` |
| `files.writeText(token, text)` | 写入 UTF-8 到 token 文件。 | `token: string, text: string` | `{ success: true }` |
| `files.readBase64(token)` | 以 base64 读取 token 文件。 | `token: string` | `string` |
| `files.writeBase64(token, bodyBase64)` | 写入 base64 到 token 文件。 | `token: string, bodyBase64: string` | `{ success: true }` |
| `files.getMetadata(token)` | 读取 token 元数据。 | `token: string` | `FileMetadata` |
| `files.release(token)` | 释放 token。 | `token: string` | `{ released: true }` |
| `fetch.request(options)` | 通过宿主请求公开 HTTPS URL。 | `options: FetchOptions` | `FetchTextResponse \| FetchBase64Response` |

`files.readText(token)` 和 `files.readBase64(token)` 会拒绝超过 1 MiB 的文件。`fetch.request` 不使用浏览器 cookie，不允许代理凭据，阻止 localhost、私有和保留地址，响应体最多 1 MiB，10 秒超时，最多跟随 3 次重定向。
