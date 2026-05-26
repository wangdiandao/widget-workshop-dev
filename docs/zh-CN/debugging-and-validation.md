# 调试与校验

发布或分享组件前，应先完成本地校验。多数问题来自路径越界、schema 不匹配、权限类别未声明、locale 文件缺失，或误以为用户已经授权。

## 包结构清单

- `manifest.json` 是合法 JSON，并包含必填字段。
- `index.html` 位于包根目录。
- `preview` 指向包内存在的 `.png`、`.jpg` 或 `.jpeg` 文件。
- `windowSize.width` 与 `windowSize.height` 是正数。
- 如果声明 `dragArea`，矩形必须完整位于 `windowSize` 内。
- `windowShape.cornerRadius` 没有超出窗口尺寸。
- `hasCustomSettings` 与 `scripts/settings.json` 是否存在保持一致。
- `categories` 与 `permissions` 使用公开契约中的类别 key。

## 本地化清单

- `locales` 缺失或 `locales.enable:false` 时，不要求 locale 文件。
- `locales.enable:true` 时，必须声明 `default` 和 `supported`。
- `supported` 必须包含 `default`。
- 每个 supported 语言都必须存在 `locales/<language>.json`。
- 如果需要本地化组件列表名称，在 locale 文件中提供 `title`。

## settings 清单

- `scripts/settings.json` 的 `schemaVersion` 是 `1`。
- 每个字段都有 `key`、`label`、`type`、`control`、`default`。
- `select` 和 `segmented` 字段提供 `options`。
- `default` 与字段类型和 option value 匹配。
- `hasCustomSettings:false` 时，不应存在 `scripts/settings.json`。

## 运行时清单

- 每个 Host API 调用都用 `try`/`catch` 保护。
- 遇到 `PermissionDenied` 时，先检查 manifest 声明和用户授权。
- 遇到 `MethodNotFound` 时，检查 category 和 method 是否来自 `contracts/host-api.d.ts`。
- 包文件变更后重新导入。
- 使用发布时同样的 permission category 和 settings 值测试。

## 验证命令

验证单个组件包：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path <component-source>
```

验证本仓库：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Repository.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\Test-Plugin.ps1 -PluginPath .\plugins\widget-workshop
git diff --check
```

当 Host API、权限类别或组件分类契约变化，并且本地有 Widget Workshop 主仓库时，运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Sync-ContractsFromHost.ps1 -WidgetWorkshopRepo E:\repos\widget_workshop
```
