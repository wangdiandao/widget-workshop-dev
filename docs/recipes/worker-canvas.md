# Worker、Canvas 与 Wasm

适用于粒子、轻量模拟、统计与包内计算模块。examples/stardust 展示装饰绘制，examples/worker-canvas 展示任务 Worker 和画布。先区分计算任务和持续绘制：隐藏时停止动画不一定要取消用户已请求的计算。

## Worker 只做业务计算

Worker 没有宿主桥接；主页面调用 widgetHost，校验有界输入后发送纯业务数据。只使用包内 Worker 和 Wasm，不从网络加载脚本。消息含任务 ID，主线程丢弃过期结果。

最多一项在途计算；需要连续画面时最多一条在途和一份最新待发，Worker 确认消费后才再发，避免无界 postMessage。限定输入长度、任务超时、输出大小和绘制频率；异常/超时终止 Worker，等待用户明确重试，不无限自动重启。

## 生命周期与降级

检测 OffscreenCanvas、WebGL2、Wasm 等实际支持并验证初始化；API 存在不足以说明内容运行成功。初始化失败提供 Canvas2D、静态图或说明。减少动画只画一帧，省电限帧，隐藏/锁定/挂起暂停绘制；恢复不补积压帧。

pagehide 终止 Worker、取消帧/定时器并解除监听。Wasm 编译结果可能迟到，不能声称 AbortController 能停止引擎编译；只停止后续实例化和页面更新。音频在用户交互后创建，遵守宿主静音和生命周期，离页释放节点与 AudioContext。

验证持续输入背压、取消、超时、初始化失败、隐藏恢复及静态降级。源码与边界见[星河微光](../reference/modules/stardust.md)、[开发模块](../reference/modules/development.md)与[音频模块](../reference/modules/audio.md)。
