// 只接受有限的纯文本模型；绝不把来源 HTML 或网址直接作为 DOM 执行。
export function safeHttps(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function normalizeFeed(value) {
  if (!value || !Array.isArray(value.items) || value.items.length > 500) throw new Error('INVALID_FEED');
  const seen = new Set();
  const items = [];
  for (const row of value.items) {
    if (!row || typeof row.id !== 'string' || row.id.length < 1 || row.id.length > 128
      || typeof row.title !== 'string' || !row.title.trim() || row.title.length > 200) continue;
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    items.push({id: row.id, title: row.title, url: safeHttps(row.url)});
    if (items.length === 50) break;
  }
  return {items};
}

export const sampleFeed = {items: [
  {id: 'welcome', title: '欢迎使用 Widget Workshop 信息流示例', url: 'https://wangdiandao.github.io/widget-workshop-dev/'},
  {id: 'source', title: '在配置中填写符合协议的 HTTPS JSON 地址，或留空继续使用包内模拟数据。'},
  {id: 'boundary', title: '资讯正文只作为文本展示；外链授权被拒绝不影响阅读。'}
]};
