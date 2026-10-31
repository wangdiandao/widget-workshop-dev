# 文件与图片工具

examples/file-tool 演示可信选择、受限读取、统计、PNG 处理、导出、绑定目录和剪贴板。用户文件是业务输入，不是发布包资源；不要把临时 fileId 当成本机永久路径。

## 文件流水线

调用 files.open 获取只读临时句柄，按 files.read 的 offset/length 拉取有界块，验证返回 offset 和 eof，完成或失败后 files.close。多选使用 `{multiple:true}`，返回 `{files}`，不能按单文件返回值处理。拖入和剪贴板文件同样是有期限的只读句柄。

纯统计可在 Worker 处理；大图片限制解码尺寸和像素总量，不只看压缩文件字节。计算和预览分开，取消释放 Worker、对象 URL、画布与临时句柄。为文件类型不符、空文件、超额和内容损坏提供明确反馈。

## 导出与目录写入

exports.begin 声明名称和精确 sizeBytes，exports.write 按偏移写入 Base64 块，完成后 exports.save 触发实际系统保存；无论成功、取消还是失败都关闭 exportId。保存前不接触目标正文；文件选择与覆盖仍由系统可信流程处理。

绑定目录读取是基础功能。目录写入需要 directory.write，且只在用户绑定范围内；目录删除为单项操作，不提供任意路径或递归删除。directory.watch.* 只是“需要重新扫描”的通知，使用有界分页重建视图，不把事件流当可靠完整历史。

## 扩展与验证

PNG 处理可导出或在获得 clipboard 授权后复制；拒绝剪贴板时仍可保存。HTML 剪贴板要使用受控片段，不执行粘贴内容。覆盖/取消、撤销绑定、读取中离页、watch 失效和导出失败都应释放资源。细节见[文件工具模块](../reference/modules/file-tool.md)及[桌面扩展](../reference/contracts/desktop-extensions.md)。
