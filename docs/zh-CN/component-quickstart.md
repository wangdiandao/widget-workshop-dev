# 组件快速开始

## 创建组件源码目录

在应用安装数据目录之外创建本地源码目录。所有组件文件都应保留在该目录内，避免包内路径越界。

```text
my-clock/
  manifest.json
  index.html
  preview.png
  locales/
    en-US.json
    zh-CN.json
  scripts/
    settings.json
    settings.default.json
```

该源码目录由 component developer 编辑。应用导入时会复制并校验它。

## 最小组件

没有生成式设置页、也没有本地化文本文件时，可以使用如下 manifest：

```json
{
  "packageId": "com.example.minimal-clock",
  "displayName": "Minimal Clock",
  "version": "1.0.0",
  "description": "A simple desktop clock.",
  "preview": "preview.png",
  "windowSize": { "width": 320, "height": 180 },
  "hasCustomSettings": false,
  "categories": ["desktop_personalization"],
  "permissions": ["host"]
}
```

`index.html` 是固定入口。不要在 manifest 中添加 `entry` 字段。

不要添加 `author` 字段。Workshop 作者来自 Steam 上传者身份。

如果组件类似桌宠，只希望可见窗口的一部分触发拖动，可以在 manifest 中添加 `dragArea`：

```json
"dragArea": { "x": 48, "y": 96, "width": 128, "height": 132 }
```

未声明 `dragArea` 时，未锁定状态下整个组件窗口都可以拖动。

## 实现 `index.html`

页面准备好后，通过 `window.widgetWorkshop` 读取组件上下文和设置：

```html
<script>
async function start() {
  const context = await window.widgetWorkshop.host.getComponentContext();
  const settings = await window.widgetWorkshop.host.getComponentSettings();
  document.body.textContent = `${context.displayName} ready`;
}

start().catch(error => {
  document.body.textContent = error?.message || "Widget Workshop component error";
});
</script>
```

始终处理 Host API Promise 的 rejected 状态。受权限保护的调用可能返回 `PermissionDenied`，未知 category 或 method 会返回 `MethodNotFound`。

## 导入与测试

1. 在 Widget Workshop 中打开开发者模式。
2. 进入开发工作区。
3. 添加组件源码目录。
4. 校验 manifest、preview、locales、settings schema 和入口文件。
5. 导入受控本地副本。
6. 在组件列表中启用该组件。
7. 使用发布时同样的 permission category 和 settings 值测试组件。

每次修改 `manifest.json`、`index.html`、`preview.png`、locale 文件或 settings 文件后，都应重新导入。

## 继续阅读

- [manifest 参考](manifest-reference.md)
- [settings 参考](settings-reference.md)
- [Host API 参考](host-api-reference.md)
- [权限与安全](permissions-and-security.md)
- [调试与校验](debugging-and-validation.md)
