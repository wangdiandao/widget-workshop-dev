# 快速开始

## 启用开发入口

1. 在 Widget Workshop 设置页打开开发者模式。
2. 侧边栏会出现开发页面入口。
3. 在开发页面右上角创建组件，填写名称、尺寸、预览图、权限等属性。
4. 在项目卡片中打开源码目录，编辑组件文件。
5. 修改包文件后重新导入，再在组件列表中启用并测试。

创建组件时可以选择是否启用多语言文本。关闭时，组件不读取 `locales/*.json`，组件名称使用 `displayName`，界面文字直接写在 `index.html`。开启时，模板会生成当前默认语言的一个 `locales/<language>.json` 起点，之后可自行扩展 `supported`。

## 最小组件目录

```text
minimal-clock/
  manifest.json
  index.html
  preview.png
```

如果组件有设置页，添加 `scripts/settings.json`。如果启用本地化，添加 `locales/<language>.json`。

## 最小 manifest

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
  "permissions": ["host"],
  "locales": { "enable": false }
}
```

`packageId` 是组件唯一 ID，建议使用反向域名风格的小写字符串。`index.html` 是固定入口，不要在 manifest 中添加 `entry`。Workshop 作者来自上传所用 Steam 账号，不要添加 `author` 字段。

## 编写入口页面

组件页面运行在 WebView2 中。页面加载后，通过 `window.widgetWorkshop` 读取上下文、设置和授权状态：

```html
<script>
async function start() {
  const api = window.widgetWorkshop;
  const [context, settings, grants] = await Promise.all([
    api.host.getComponentContext(),
    api.host.getComponentSettings(),
    api.host.getPermissionGrants()
  ]);

  document.body.textContent = `${context.displayName} ready`;
  document.body.dataset.canFetch = grants.fetch === true ? "true" : "false";
}

start().catch(error => {
  document.body.textContent = error?.message || "Widget Workshop component error";
});
</script>
```

所有 Host API 方法都返回 Promise。受权限保护的方法可能因 `PermissionDenied` 失败；未知类别或方法会返回 `MethodNotFound`。组件应显示可理解的降级状态，而不是空白。

## 拖动区域

未声明 `dragArea` 时，未锁定状态下整个窗口都可触发拖动。桌宠或透明装饰类组件通常需要只让一部分区域可拖动：

```json
"dragArea": { "x": 48, "y": 96, "width": 128, "height": 132 }
```

拖动区域必须完整位于 `windowSize` 内。不要把拖动区域放到可见显示区域外。

## 本地校验

在仓库中可用示例包验证命令：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Test-ComponentPackage.ps1 -Path .\examples\minimal-clock
```

开发自己的组件时，将 `-Path` 指向组件源码目录。校验通过后，再在 Widget Workshop 中导入并测试实际运行效果。
