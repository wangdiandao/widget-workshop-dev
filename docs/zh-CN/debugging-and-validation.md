# 调试与校验

发布或分享组件前，应先完成本地校验。多数问题来自路径、schema 不匹配、permission category 未声明，或误以为宿主已经授权。

## 导入校验清单

- `manifest.json` 是合法 JSON，并包含必填字段。
- `index.html` 位于包根目录。
- `preview` 指向包内已存在的 `.png`、`.jpg` 或 `.jpeg` 文件。不再支持 SVG 预览图。
- `windowSize.width` 与 `windowSize.height` 是正有限数。
- 如果声明 `dragArea`，其 `x`、`y`、`width` 和 `height` 必须完整位于 `windowSize` 内。
- `windowShape.cornerRadius` 没有超出固定窗口尺寸。
- `locales.supported` 对应文件存在于 `locales/<language>.json`。
- `hasCustomSettings` 与 `scripts/settings.json` 是否存在保持一致。
- `scripts/settings.default.json` 的值与 `scripts/settings.json` 兼容。
- `categories` 和 `permissions` 使用可接受的类别 key。

## 运行时清单

- 每个 Host API 调用都用 `try`/`catch` 保护。
- 遇到 `PermissionDenied` 时，先检查声明与授权，不要直接判断桥接损坏。
- 添加新 category 或 method 名称时，检查 `MethodNotFound`。
- 包文件变更后重新导入。
- 使用发布时同样的 manifest permission category 列表测试。

## settings 调试

如果设置页不出现，确认 `hasCustomSettings` 为 `true`，并且 `scripts/settings.json` 中 `schemaVersion` 是 1。

如果重置操作缺失，确认 `scripts/settings.default.json` 存在、是 JSON object，并且每个值都匹配声明的字段类型与 options。

## Host API 调试

对 `fetch.request`，分别判断 `FetchBlocked`、`FetchTimeout` 和 `FetchTooLarge`。被阻止的 URL 是策略问题，不是重试网络请求能解决的问题。

对 `dialog.showOpenFilePicker(options)` 后接 `files.readText(token)` 的流程，确认传入的是返回的 token 字符串，而不是文件路径。

对 `shell.openPackageFile(path)`，确认目标是包内相对路径，并且不是可执行或主动文件类型。
