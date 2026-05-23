# 权限与安全

Widget Workshop 使用 permission category 声明加宿主授权来控制受保护的 Host API 方法。component developer 应只请求组件行为真正需要的最小类别。

## 声明与授权

在 `manifest.json` 中声明 permission category：

```json
{
  "permissions": ["host", "fetch", "dialog", "files"]
}
```

manifest 声明表示组件可能请求哪些能力。宿主授权表示当前安装允许哪些能力。任一侧缺失时，方法都会返回 `PermissionDenied`。

部分上下文方法无需授权即可使用：`app.getLocaleInfo()`、`host.getComponentContext()`、`host.getComponentSettings()`、`host.getRuntimeInfo()` 和 `host.getPermissionGrants()`。

## 类别选择建议

- 使用 `host` 读取组件 settings、运行时状态、权限授权和显示策略。
- 使用 `fetch` 请求公开 HTTPS 数据。
- 使用 `dialog` 与 `files` 组合访问用户选择的文件。
- 使用 `storage` 保存组件私有 key-value 数据。
- 只有明确读写剪贴板时才使用 `clipboard`。
- 只有打开外部链接、包内文件或已保存的文件设置时才使用 `shell`。
- 面板或设备监控类组件可使用 `process`、`system`、`screen`、`theme` 和 `power`。

## fetch 边界

`fetch.request` 会阻止非 HTTPS、localhost、私有地址、本地地址和保留地址目标，也会阻止受控 headers 和过大响应。把它视为公开数据 API，不要把它当成本地网络扫描能力。

## 文件边界

文件读写需要 `dialog.showOpenFilePicker(options)` 或 `dialog.showSaveFilePicker(options)` 返回的 token。不要把 token 当作持久 settings 保存；token 只在当前会话有效，token 元数据不会暴露绝对路径。

`files.readText(token)` 等方法会在 token 未知、已释放或属于其他组件时失败。

## shell 边界

`shell.openPackageFile(path)` 与 `shell.showPackageItemInFolder(path)` 接收包内相对路径。它们不是任意本地路径启动 API。

`shell.launchConfiguredFile(path)` 与 `shell.getConfiguredFileIcon(path)` 只接收本组件 `file` settings 保存过的路径。这些 settings-scoped 方法仍要求组件声明 `shell` permission category。

组件页面不能通过 Host API 写入组件 settings。组件私有可变数据请使用 `storage.*`。
