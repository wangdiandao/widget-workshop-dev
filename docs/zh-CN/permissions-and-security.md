# 权限与安全

Widget Workshop 通过 manifest 权限声明和用户授权控制敏感 Host API。组件应只申请真实需要的最小权限类别。

## 声明与授权

在 `manifest.json` 中声明权限类别：

```json
{
  "permissions": ["host", "fetch", "dialog", "files"]
}
```

manifest 声明表示组件可能使用这些能力；用户授权表示当前安装允许使用。任一侧缺失时，受保护方法都会返回 `PermissionDenied`。

部分上下文方法不要求用户授权：`app.getLocaleInfo()`、`host.getComponentContext()`、`host.getComponentSettings()`、`host.getRuntimeInfo()` 和 `host.getPermissionGrants()`。

## 类别选择

- `host`：读取组件 settings、运行时状态、授权状态和显示策略。
- `fetch`：请求公开 HTTPS 数据。
- `dialog` + `files`：访问用户选择的文件。
- `storage`：保存组件私有 key-value 数据。
- `clipboard`：明确读写剪贴板时使用。
- `shell`：打开外部链接、包内被动文件或已保存的 file setting。
- `process`、`system`、`screen`、`theme`、`power`：用于仪表盘、设备状态、环境感知类组件。

## 网络边界

`fetch.request` 只面向公开 HTTPS 数据。它会阻止非 HTTPS、localhost、私有地址、本地地址和保留地址目标，也会限制受控 headers、重定向次数、超时和响应体大小。不要把它设计成本地网络扫描或内网访问能力。

## 文件边界

文件读写必须先由 `dialog.showOpenFilePicker(options)` 或 `dialog.showSaveFilePicker(options)` 返回 token，再把 token 传给 `files.*`。

不要把 token 当作持久设置保存。token 是会话级授权，元数据不暴露绝对路径，释放后不能继续使用。

## shell 边界

`shell.openPackageFile(path)` 和 `shell.showPackageItemInFolder(path)` 只接受包内相对路径。`openPackageFile` 会阻止可执行文件和主动脚本类型。

`shell.launchConfiguredFile(path)` 和 `shell.getConfiguredFileIcon(path)` 只接受当前组件 `file` setting 保存过的路径，并且仍要求 manifest 声明 `shell` category。

组件页面不能通过 Host API 写入组件 settings。运行时可变数据请使用 `storage.*`。
