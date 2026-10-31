const comments = new Map([
  ['组件清单中的标准标签；英文身份以 protocol.json.contentTags 为准，未知清单值不展示或上传。', 'Standard manifest tags use the English identifiers in protocol.json.contentTags; unknown values are omitted from display and upload.'],
  ['宿主实际显示语言，无需权限；与 Windows 区域格式 system.locale 分开。', 'Actual host display language, available without authorization; separate from the Windows regional format in system.locale.'],
  ['宿主实际昼夜主题，包含宿主覆盖；无需权限，与 system.theme 分开。', 'Actual host light/dark theme, including the host override; available without authorization and separate from system.theme.'],
  ['Windows 强调色 #RRGGBB；未采样或不可用为 null。', 'Windows accent color as #RRGGBB; null when not sampled or unavailable.'],
  ['系统文字大小倍率 1–2.25，与显示器 DPI 分开；不可用为 null。', 'System text scale from 1 to 2.25, separate from display DPI; null when unavailable.'],
  ['muted 为实际原生状态，包含全局覆盖和实例静音。', 'muted reflects effective native state, including the global override and instance mute.'],
  ['撤下当前实例原文档的即时通知；有效引用重复调用成功，不代表已读。', 'Dismiss an immediate notification owned by this instance and document; repeated calls with a valid reference succeed. Success does not indicate that it was read.'],
  ['实例/取消检查后先拒绝 JSON UTF-8 超过256 KiB的新值；合法首次写入仍完整校验磁盘记录与总额度。', 'After instance and cancellation checks, reject new JSON values exceeding 256 KiB in UTF-8; a valid first write fully validates disk records and total quota.'],
  ['冷删除仅校验目标记录，不存在也成功；目标损坏仍失败，后续合法首次 set 仍完整校验配额。', 'Cold removal validates only the target record and succeeds if absent; corruption still fails. A subsequent valid first set fully validates quota.'],
  ['正常退出前的一次有界保存机会，无退出否决权；每文档最多一份。', 'One bounded save opportunity per document before normal application exit; it cannot veto exit.'],
  ['本文档的探测报告；API 存在不等于内容实测成功，音频不会自动播放。', 'Probe report for this document; API presence does not establish successful content execution. Audio requires explicit playback.'],
  ['input.pointer 转发正常触摸/笔；input.normalizedCancel 的宿主取消为 isTrusted=false。\n * 取消不能用作用户手势；两项标志均不保证物理设备可用。', 'input.pointer forwards normal touch/pen input; host cancellation through input.normalizedCancel has isTrusted=false.\n * Cancellation cannot serve as a user gesture; either flag alone does not establish physical device availability.']
]);

export function englishDeclarations(source) {
  return source.replace(/\r\n/g, '\n').replace(/\/\*\* ([\s\S]*?) \*\//g, (comment, text) => {
    if (!/\p{Script=Han}/u.test(text)) return comment;
    const translated = comments.get(text);
    if (!translated) throw new Error(`SDK comment needs an English translation: ${text}`);
    return `/** ${translated} */`;
  });
}

export function englishProtocol(source) {
  return source.replace(/\r\n/g, '\n').replace(/\p{Script=Han}/gu, character =>
    character.split('').map(unit => `\\u${unit.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''));
}
