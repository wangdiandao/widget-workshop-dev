# 第一个组件：计数卡

先创建一份无需权限的页面，确认安装、启用、保存和重载路径。代码见仓库 `examples/counter`；这份计数使用实例 KV，各显示器独立。

## 创建目录

在宿主开启开发者模式，进入开发页选择“新建组件”；也可以复制 `examples/counter` 到自己的项目目录，替换 widgetId，再用“添加组件”选择该目录。宿主不运行作者构建命令。选择的目录必须包含可运行的 manifest 和入口文件。

```text
counter/
  manifest.json
  index.html
  style.css
  main.js
```

## 声明作品

```json
{
  "schemaVersion": 1,
  "kind": "widget",
  "widgetId": "a7253c66-6ea5-46d1-ad99-54e2a036e612",
  "version": "0.0.1",
  "hostApiMajor": 1,
  "name": "计数卡",
  "author": "Your Name",
  "entry": "index.html",
  "capabilities": [],
  "configuration": []
}
```

这里的 UUID 仅是示例。可用 PowerShell `[guid]::NewGuid()` 为自己的作品生成身份。window 可省略，默认 320×200 DIP、不透明、置底。完整字段见[组件包协议](../reference/contracts/component.md)。

## 等待宿主再调用

入口使用普通包内模块：`<script type="module" src="main.js"></script>`。宿主会在业务脚本之前提供 `window.widgetHost`，不要引用 SDK script，也不要把 SDK 三件套复制进包。普通浏览器预览只能看页面，不能证明桥接可用。

```js
const controller = new AbortController();
let active = true;
window.addEventListener('pagehide', () => {
  active = false;
  controller.abort();
}, {once: true});

await widgetHost.ready;
if (active) {
  const saved = await widgetHost.call('storage.get', {key: 'count'}, {
    signal: controller.signal
  });
  if (active) {
    const count = saved.found && Number.isSafeInteger(saved.value)
      && saved.value >= 0 ? saved.value : 0;
    document.querySelector('output').textContent = String(count);
  }
}
```

完整示例还串行写入、先保存成功再更新显示，并在 pagehide 移除按钮处理器。错误用 `error.code` 区分，失败保留原值；不要把写入失败伪装为成功。

## 检查和运行

在开发页“检查组件包”选择项目，检查通过后添加开发组件，在目标显示器启用。安装成功不会自动启用。打开对应运行实例的调试工具，检查脚本错误；改文件并保存，自动重载会等待至少一秒稳定后复制校验。关闭自动重载时手动点“重载”。

验证点击后重载仍保留计数、重复快速点击不会并发覆盖、停用后不再回填旧页面。没有实体输入或多屏环境时，记录未测试范围。下一步阅读[项目与包](package.md)和[配置与数据](data.md)。
