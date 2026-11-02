/** 组件清单中的标准标签；小写英文标识以 protocol.json.contentTags 为准，未知清单值不展示或上传。 */
type WidgetTag = 'information' | 'productivity' | 'system' | 'files' | 'media' | 'decoration' | 'entertainment' | 'education' | 'lifestyle' | 'development';
type JsonValue = null | boolean | number | string | JsonValue[] | {[key: string]: JsonValue};
type WidgetCapability = 'external.open' | 'location' | 'notifications' | 'clipboard' | 'directory.write' | 'screen.capture';
interface WidgetContext {
  apiMajor: 1; features: string[]; limits: Record<string, number>;
  view: {kind:'main'|'panel';panelId?:string};
  instanceId: string; displayId: string; visible: boolean;
  /** 宿主实际显示语言，无需权限；与 Windows 区域格式 system.locale 分开。 */
  language: 'zh-CN' | 'en-US';
  /** 宿主实际昼夜主题，包含宿主覆盖；无需权限，与 system.theme 分开。 */
  theme: 'light' | 'dark';
  i18n: {defaultLanguage?: string; translations?: Record<string, Record<string, string>>};
  configuration: Record<string, JsonValue>; capabilities: Partial<Record<WidgetCapability, boolean>>;
  environment: WidgetEnvironment;
  system: SystemContext;
  audio: HostAudioPolicy;
  runtime: RuntimeInfo;
}
interface SystemContext {
  theme: 'light' | 'dark' | 'unknown'; locale: string | null;
  /** Windows 强调色 #RRGGBB；未采样或不可用为 null。 */
  accentColor: string | null;
  /** 系统文字大小倍率 1–2.25，与显示器 DPI 分开；不可用为 null。 */
  textScaleFactor: number | null;
  reducedMotion: boolean | null; highContrast: boolean | null; sessionLocked: boolean | null;
  power: {source: 'ac' | 'battery' | 'unknown'; energySaver: boolean | null};
}
/** muted 为实际原生状态，包含全局覆盖和实例静音。 */
interface HostAudioPolicy {muted: boolean;}
interface RuntimeInfo {engine: 'webview2'; version: string; platform: 'windows'; architecture: 'x64';}
interface CompatibilityReport {
  host: {features: string[]; limits: Record<string, number>; runtime: RuntimeInfo};
  apis: {dedicatedWorker: boolean; offscreenCanvas: boolean; webAssembly: boolean; audioContext: boolean; gamepad: boolean};
  devices: {webgl2: 'available' | 'unavailable'; audioPlayback: 'not-tested'; gamepadInput: 'not-tested'};
}
type InputRegion = {x:number; y:number; width:number; height:number; points?:never} |
  {points:{x:number; y:number}[]; x?:never; y?:never; width?:never; height?:never};
interface WidgetEnvironment {
  scale: number; editing: boolean; workArea: {width: number; height: number};
  bounds: {x: number; y: number; width: number; height: number};
}
interface HostError extends Error { code: string; }
interface SaveSummary {slot: string; revision: string; savedAt: number;}
interface SaveSnapshot extends SaveSummary {value: JsonValue;}
interface DirectoryEntry { name: string; relativePath: string; kind: 'directory' | 'file'; sizeBytes: number; modifiedAt: string; }
type Header = {name: string; value: string; secretBindingId?: never; prefix?: never} |
  {name: string; secretBindingId: string; prefix?: string; value?: never};
interface HostImage {mimeType:'image/png';bodyBase64:string;width:number;height:number;}
interface MediaSession {albumTitle:string;albumArtist:string;subtitle:string;trackNumber:number;albumTrackCount:number;genres:string[];playbackType:'music'|'video'|'image'|'unknown';timeline:{startMs:number;endMs:number;positionMs:number;minSeekMs:number;maxSeekMs:number;updatedAt:number};sessionId:string; title:string; artist:string; playback:'closed'|'opened'|'changing'|'stopped'|'playing'|'paused'|'unknown'; controls:{play:boolean; pause:boolean; next:boolean; previous:boolean; seek:boolean};}
interface Reminder {key:string; dueAt:number; expiresAt:number; title:string; body:string;}
interface WidgetContextMenuItem {id: string; label: string; enabled?: boolean; checked?: boolean;}
interface ImportedFile {fileId: string; name: string; sizeBytes: number;}
interface SelectedFiles {files: ImportedFile[];}
interface HostMethods {
  'screen.capture.open': [Record<string,never>,{captureId:string}];
  'screen.capture.read': [{captureId:string},{frame:HostImage|null}];
  'screen.capture.close': [{captureId:string},Record<string,never>];
  'desktop.pointer.get': [Record<string,never>,{position:{x:number;y:number}|null}];
  'desktop.windows.get': [Record<string,never>,{windows:{bounds:{x:number;y:number;width:number;height:number};foreground:boolean}[];truncated:boolean}];
  'system.activity.get': [Record<string,never>,{state:'active'|'idle'|'unknown'}];
  'audio.output.get': [Record<string,never>,{volume:number;muted:boolean}];
  'audio.output.set': [{volume:number;muted?:boolean}|{volume?:number;muted:boolean},{volume:number;muted:boolean}];
  'files.image': [{fileId:string;kind:'icon'|'thumbnail';size:number},HostImage];
  'directory.image': [{bindingId:string;relativePath:string;kind:'icon'|'thumbnail';size:number},HostImage];
  'clipboard.readImage': [Record<string,never>,{image:HostImage|null}];
  'clipboard.writeImage': [{bodyBase64:string},Record<string,never>];
  'clipboard.readHtml': [Record<string,never>,{html:string|null}];
  'clipboard.writeHtml': [{html:string;text:string},Record<string,never>];
  'clipboard.readFiles': [Record<string,never>,SelectedFiles];
  'media.artwork': [{sessionId:string},{image:HostImage|null}];

  'directory.write': [{bindingId:string;relativePath:string;bodyBase64:string;overwrite?:boolean},{writtenBytes:number}];
  'directory.mkdir': [{bindingId:string;relativePath:string},Record<string,never>];
  'directory.rename': [{bindingId:string;relativePath:string;newRelativePath:string},Record<string,never>];
  'directory.remove': [{bindingId:string;relativePath:string},Record<string,never>];
  'exports.startDrag': [{exportId:string},{accepted:boolean}];
  'shortcuts.setActions': [{actions:{id:string;label:string}[]},Record<string,never>];
  'audio.capture.open': [Record<string,never>,{captureId:string;sampleRate:number;channels:number;format:'float32le'}];
  'audio.capture.read': [{captureId:string;maxFrames:number},{bodyBase64:string;frames:number;droppedFrames:number}];
  'audio.capture.close': [{captureId:string},Record<string,never>];
  'panels.open': [{key:string;path:string;title:string;width:number;height:number},{panelId:string}];
  'panels.activate': [{panelId:string},{activated:boolean}];
  'panels.close': [{panelId:string},Record<string,never>];
  'panels.post': [{panelId:string;value:JsonValue},Record<string,never>];
  'credentials.set': [{key:string;value:string},Record<string,never>];
  'credentials.get': [{key:string},{found:boolean;value:string|null}];
  'credentials.remove': [{key:string},Record<string,never>];
  'credentials.clear': [Record<string,never>,Record<string,never>];
  'files.setDropEnabled': [{enabled:boolean}, Record<string,never>];
  'contextMenu.setItems': [{items: WidgetContextMenuItem[]}, Record<string, never>];
  'cache.get': [{key:string},{found:boolean;bodyBase64:string|null}];
  'cache.put': [{key:string;bodyBase64:string},Record<string,never>];
  'cache.remove': [{key:string},Record<string,never>];
  'cache.clear': [Record<string,never>,Record<string,never>];
  'reminders.set': [Reminder,Record<string,never>];
  'reminders.list': [Record<string,never>,{items:Reminder[]}];
  'reminders.remove': [{key:string},Record<string,never>];
  'reminders.clear': [Record<string,never>,Record<string,never>];
  'media.get': [Record<string,never>,{session:MediaSession|null}];
  'media.control': [{sessionId:string;command:'play'|'pause'|'next'|'previous';positionMs?:never}|{sessionId:string;command:'seek';positionMs:number},{accepted:boolean}];
  'clipboard.readText': [Record<string, never>, {text:string|null}];
  'clipboard.writeText': [{text: string}, Record<string, never>];
  'directory.watch.open': [{bindingId: string}, {watchId: string; revision: string; rescan: true}];
  'directory.watch.poll': [{watchId: string}, {watchId: string; revision: string; rescan: true}];
  'directory.watch.close': [{watchId: string}, Record<string, never>];
  'lifecycle.finishClose': [{token: string; success: boolean}, Record<string, never>];
  'network.open': [{url: string; method: string; headers: Header[]; bodyBase64?: string}, {streamId: string; status: number; headers: {name: string; value: string}[]; finalUrl: string}];
  'network.read': [{streamId: string; offset: number; length: number}, {offset: number; bodyBase64: string; eof: boolean}];
  'network.close': [{streamId: string}, Record<string, never>];
  'collaboration.publish': [{value: JsonValue}, {id: string}];
  'collaboration.get': [{afterId: string | null}, {found: boolean; id: string | null; value: JsonValue}];
  'saves.context': [Record<string, never>, {scope: 'installation'}];
  'saves.list': [Record<string, never>, {slots: SaveSummary[]}];
  'saves.load': [{slot: string}, {found: boolean; current: SaveSnapshot | null; previous: SaveSummary | null; recovered: boolean}];
  'saves.commit': [{slot: string; expectedRevision: string | null; value: JsonValue}, SaveSummary];
  'saves.restore': [{slot: string; expectedRevision: string}, SaveSummary];
  'files.open': [{multiple?:boolean}, ImportedFile | SelectedFiles];
  'assets.open': [{path: string}, {fileId: string; name: string; sizeBytes: number}];
  'exports.begin': [{name: string; sizeBytes: number}, {exportId: string}];
  'exports.write': [{exportId: string; offset: number; bodyBase64: string}, {writtenBytes: number}];
  'exports.save': [{exportId: string}, {name: string; sizeBytes: number}];
  'exports.close': [{exportId: string}, Record<string, never>];
  'files.read': [{fileId: string; offset: number; length: number}, {offset: number; bodyBase64: string; eof: boolean}];
  'files.close': [{fileId: string}, Record<string, never>];
  'window.setInputRegions': [{regions: InputRegion[]}, Record<string, never>];
  'window.beginDrag': [Record<string, never>, Record<string, never>];
  'notifications.show': [{title:string;body:string;actions?:{id:string;label:string}[]},{notificationId:string}];
  /** 撤下当前实例原文档的即时通知；有效引用重复调用成功，不代表已读。 */
  'notifications.dismiss': [{notificationId:string},Record<string,never>];
  'config.get': [Record<string, never>, Record<string, JsonValue>];
  'config.set': [{values: Record<string, JsonValue>}, Record<string, JsonValue>];
  'storage.get': [{key: string}, {found: boolean; value: JsonValue}];
  /** 实例/取消检查后先拒绝 JSON UTF-8 超过256 KiB的新值；合法首次写入仍完整校验磁盘记录与总额度。 */
  'storage.set': [{key: string; value: JsonValue}, Record<string, never>];
  /** 冷删除仅校验目标记录，不存在也成功；目标损坏仍失败，后续合法首次 set 仍完整校验配额。 */
  'storage.remove': [{key: string}, Record<string, never>];
  'window.setSize': [{width: number; height: number}, {width: number; height: number}];
  'window.moveTo': [{x: number; y: number}, Record<string, never>];
  'network.request': [{url: string; method: string; headers: Header[]; bodyBase64?: string}, {status: number; headers: {name: string; value: string}[]; bodyBase64: string; finalUrl: string}];
  'system.metrics.get': [Record<string, never>, {sampledAt: string; cpuPercent: number | null; memoryUsedBytes: number | null; memoryTotalBytes: number | null; disks: {id: string; label: string; totalBytes: number | null; freeBytes: number | null}[]; networkReceiveBytesPerSecond: number | null; networkSendBytesPerSecond: number | null}];
  'directory.list': [{bindingId: string; relativePath: string; cursor?: string | null}, {entries: DirectoryEntry[]; nextCursor: string | null}];
  'directory.read': [{bindingId: string; relativePath: string}, {bodyBase64: string}];
  'directory.cancel': [{cursor: string}, Record<string, never>];
  'target.open': [{bindingId: string; directoryBindingId?: never; relativePath?: never} |
    {directoryBindingId: string; relativePath: string; bindingId?: never}, Record<string, never>];
  'external.open': [{url: string}, Record<string, never>];
  'request.cancel': [{requestId: string}, Record<string, never>];
}
interface HostEvents {
  'shortcuts.triggered': {id:string};
  'notifications.activated': {notificationId:string;actionId:string|null};
  'panels.message': {panelId:string;value:JsonValue};
  'panels.closed': {panelId:string};
  'files.dropped': SelectedFiles;
  'files.dropFailed': {code:string;message:string};
  'contextMenu.selected': {id: string};
  'language.changed': {language: WidgetContext['language']};
  'theme.changed': {theme: WidgetContext['theme']};
  'lifecycle.closing': {token: string; reason: 'applicationExit'; remainingMs: number};
  'audio.changed': HostAudioPolicy;
  'system.changed': SystemContext;
  'lifecycle.changed': {state: 'suspending' | 'resumed' | 'locked' | 'unlocked'};
  'environment.changed': WidgetEnvironment;
  'config.changed': Record<string, JsonValue>; 'capabilities.changed': Partial<Record<WidgetCapability, boolean>>;
  'visibility.changed': {visible: boolean}; 'display.changed': {displayId: string}; 'error': HostError;
}
interface WidgetHost {
  readonly i18n: {readonly language: 'zh-CN' | 'en-US'; t(key: string): string};
  /** 正常退出前的一次有界保存机会，无退出否决权；每文档最多一份。 */
  onClosing(callback: (event: {reason: 'applicationExit'; remainingMs: number}) => void | Promise<void>): () => void;
  elapsedSince(savedAt: number, options?: {now?: number; maxMs?: number}): {elapsedMs: number; clockMovedBack: boolean; capped: boolean};
  ready: Promise<WidgetContext>; readonly context: WidgetContext | null;
  /** 本文档的探测报告；API 存在不等于内容实测成功，音频不会自动播放。 */
  compatibility(options?: {signal?: AbortSignal}): Promise<CompatibilityReport>;
  call(method: 'files.open', params: {multiple:true}, options?: {signal?:AbortSignal}): Promise<SelectedFiles>;
  call(method: 'files.open', params: {multiple?:false}, options?: {signal?:AbortSignal}): Promise<ImportedFile>;
  call<M extends 'config.get' | 'system.metrics.get'>(method: M): Promise<HostMethods[M][1]>;
  call<M extends keyof HostMethods>(method: M, params: HostMethods[M][0], options?: {signal?: AbortSignal}): Promise<HostMethods[M][1]>;
  on<E extends keyof HostEvents>(event: E, callback: (data: HostEvents[E]) => void): () => void;
}
declare const widgetHost: WidgetHost;
interface Window { widgetHost: WidgetHost; }

/** input.pointer 转发正常触摸/笔；input.normalizedCancel 的宿主取消为 isTrusted=false。
 * 取消不能用作用户手势；两项标志均不保证物理设备可用。 */
