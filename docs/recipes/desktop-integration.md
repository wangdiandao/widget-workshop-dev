# 高级桌面集成

先选最小能力和明确的失败分支，不要把“高级”理解为任意系统访问。下面都是当前宿主受限接口，参数与预算见[桌面扩展](../reference/contracts/desktop-extensions.md)、[系统集成](../reference/contracts/system-integration.md)和[完整类型](../reference/types.md)。

| 方案 | 实现链路 | 必须处理 |
| --- | --- | --- |
| 主卡片 + 详情面板 | panels.open 指向包内页面，panels.post 传 JSON，panels.close 释放 | 主/附属视图各自文档生命周期；共享实例身份与授权，消息仍校验 |
| 账号数据工具 | 组件网络登录，credentials.* 保存自身凭据或使用用户秘密绑定 | 无宿主专用账号接口；撤销/过期/登出清理；不把秘密放日志 |
| 音乐遥控 | media.get 读当前 session，再按 controls 调 media.control，media.artwork 读封面 | 没有会话、会话变化、能力不支持和封面缺失；不控制任意应用 |
| 音频可视化 | audio.capture.open/read/close 拉取默认输出混音 | 无麦克风入口；块/帧有界、主动消费和过载丢帧；隐藏暂停 |
| 屏幕取色/预览 | 获得 screen.capture，系统选择来源后 open/read/close | 用户取消、锁屏/隐藏/导航/撤权失效；不建立永久屏幕句柄 |
| 文件预览 | files.image / directory.image 取图标或缩略图 | 只读临时文件/绑定范围；图片不可用时用占位图 |
| 提醒工具 | notifications.show 或 reminders.set/list/remove | 权限拒绝、过期、宿主退出不投递；不能承诺后台闹钟 |
| 自身动作与菜单 | shortcuts.setActions、contextMenu.setItems，监听动作事件 | 标签纯文本、注册有界，重载后重新设置；动作不等于物理手势 |

## 面板与上下文

ready.context.view 区分 main 和 panel；每个文档单独注册监听、取消请求和清理。附属窗口不会产生新的安装、授权或存档。只向包内可信页面传最少业务状态，不把 panelId 当永久标识保存。

## 对环境做出反应

用 language.changed 和 i18n 显示宿主实际语言；theme.changed 显示实际宿主主题。system.accentColor 可为 null；textScaleFactor 是辅助文字倍率，与 environment.scale 的 DPI 分开。系统高对比和减少动画各有自己的可用状态，不能用强调色代替可读性。

desktop.pointer.get、desktop.windows.get、system.activity.get 只给有限几何/活跃状态，不返回输入正文、标题、历史或窗口控制。audio.output 控制系统默认输出音量，与宿主自身组件静音不同；界面应让用户知道影响范围。

每个集成先实现不可用/取消状态，再加成功路径；为流、面板、句柄和计时器设置明确所有者、定额和释放点。
