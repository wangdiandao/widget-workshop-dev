# 项目与组件包

作者项目可以有源码、依赖和构建工具；安装给用户的是构建后的静态目录。终端用户无需 Node.js，也不会执行作者的安装或构建命令。

## 包的最小边界

包必须有 manifest.json 和 entry 指定的本地 HTML；entry 省略时为 index.html。preview 可选，默认 preview.png 缺失时使用占位图；显式声明的 PNG 必须存在。资源只使用安全包内相对路径，不能路径穿越、绝对路径、链接或远程脚本。

window 声明初始/最小尺寸、初始层级以及 surface。默认不透明；透明作品必须明确 inputMode，并处理真实输入区域与恢复方式。页面 CSS 无法代替原生穿透。大小由作者声明或 window.setSize 请求，布局不覆盖作者尺寸。

## 使用构建工具

无论使用哪个前端工具，都要让入口与资源在最终目录内使用可解析的本地路径，把 manifest 一起输出。在宿主开发页绑定最终可运行目录；开发服务器 URL 不是组件包，也不由宿主运行。

SDK 类型位于本仓库 `docs/public/sdk/widget-host.d.ts`，只在包外编辑/编译环境引用。TypeScript 使用 ES2020、DOM、strict、noEmit，不用 skipLibCheck 隐藏声明错误。完成构建后检查输出中没有 widget-host.js、widget-host.d.ts 或 protocol.json，宿主会拒绝这些文件名。

## 复制、重载与身份

运行使用宿主校验后的不可变版本，不直接运行作者源码。开发页绑定目录变化触发复制和校验；无效内容保留最后成功版本。开发重载允许声明版本不变，内容哈希用作内部修订；正式版本仍使用三个非负整数的版本号。

普通本地导入不监视源码，也不是更新入口。开发中请用“添加组件”建立开发来源；目录移动用“重新定位”，仍须保持 widgetId。移除开发组件会保留作者源码，安装专属数据按宿主规则清理。

完整字段、包大小/资源/路径限额见[组件包协议](../reference/contracts/component.md)，自动重载和草稿保护见[开发模块](../reference/modules/development.md)。
