import {defineConfig} from 'vitepress';

const guideSlugs = ['overview', 'quickstart', 'package', 'data', 'security', 'lifecycle', 'publishing', 'lessons'];
const recipeSlugs = ['', 'desktop-pet', 'game', 'information-feed', 'file-tool', 'worker-canvas', 'collaboration', 'desktop-integration'];
const contractSlugs = ['component', 'configuration', 'host-api', 'saves', 'collaboration', 'cache', 'reminders', 'desktop-extensions', 'system-integration', 'layout'];
function theme(en: boolean) {
  const base = en ? '/en/' : '/';
  const items = (names: string[], slugs: string[], folder: string) => names.map((text, i) => ({text, link: `${base}${folder}/${slugs[i]}`}));
  return {
    siteTitle: en ? 'Widget Workshop · Developers' : 'Widget Workshop · 开发指南',
    nav: [
      {text: en ? 'Start building' : '开始开发', link: `${base}guide/quickstart`},
      {text: en ? 'Recipes' : '场景方案', link: `${base}recipes/`},
      {text: en ? 'Reference' : '接口参考', link: `${base}reference/`},
      {text: en ? 'AI plugin' : 'AI 插件', link: `${base}guide/ai-plugin`}
    ],
    sidebar: [
      {text: en ? 'Start building' : '开始开发', items: items(en
        ? ['Understand widgets', 'First widget', 'Projects and packages', 'Configuration and data', 'Permissions and networking', 'Lifecycle and debugging', 'Validation and publishing', 'Local-development lessons']
        : ['认识组件', '第一个组件', '项目与包', '配置与数据', '权限与联网', '生命周期与调试', '发布与检查', '本地开发经验'], guideSlugs, 'guide')},
      {text: en ? 'Recipes and solutions' : '场景与解决方案', items: items(en
        ? ['Choose a direction', 'Transparent desktop pet', 'Edge games and saves', 'Information feed', 'Files and images', 'Worker / Canvas / Wasm', 'Multi-monitor collaboration', 'Advanced desktop integration']
        : ['选一个方向', '透明桌宠', '边缘游戏与存档', '信息流', '文件与图片工具', 'Worker / Canvas / Wasm', '多屏协作', '高级桌面集成'], recipeSlugs, 'recipes')},
      {text: en ? 'Protocol reference' : '协议参考', collapsed: true, items: [
        {text: en ? 'Reference index' : '参考入口', link: `${base}reference/`},
        {text: en ? 'SDK types and limits' : '完整类型与额度', link: `${base}reference/types`},
        {text: en ? 'Glossary' : '术语', link: `${base}reference/glossary`},
        ...items(en
          ? ['Component package', 'Configuration', 'Host API', 'Saves', 'Collaboration', 'Cache', 'Reminders', 'Desktop extensions', 'System integration', 'Layouts']
          : ['组件包', '配置', '宿主 API', '存档', '协作消息', '缓存', '持久提醒', '桌面扩展', '系统集成', '布局'], contractSlugs, 'reference/contracts')
      ]},
      {text: en ? 'Development resources' : '开发资源', items: items(en
        ? ['Codex / Claude Code plugin', 'References']
        : ['Codex / Claude Code 插件', '参考资料'], ['ai-plugin', 'sources'], 'guide')}
    ],
    outline: {label: en ? 'On this page' : '本页内容', level: [2, 3] as [number, number]},
    docFooter: {prev: en ? 'Previous page' : '上一页', next: en ? 'Next page' : '下一页'},
    returnToTopLabel: en ? 'Back to top' : '返回顶部',
    sidebarMenuLabel: en ? 'Menu' : '目录',
    darkModeSwitchLabel: en ? 'Appearance' : '外观',
    footer: {message: en ? 'Current host contract · SDK 0.2.0 · MIT' : '当前宿主协议 · SDK 0.2.0 · MIT', copyright: 'Widget Workshop contributors'}
  };
}
export default defineConfig({
  title: 'Widget Workshop',
  description: 'Component developer guide',
  base: '/widget-workshop-dev/',
  sitemap: {hostname: 'https://wangdiandao.github.io/widget-workshop-dev/'},
  locales: {
    root: {label: '简体中文', lang: 'zh-CN', description: '组件开发指南', themeConfig: theme(false)},
    en: {label: 'English', lang: 'en-US', description: 'Component developer guide', themeConfig: theme(true)}
  },
  themeConfig: {
    search: {provider: 'local', options: {locales: {root: {translations: {
      button: {buttonText: '搜索', buttonAriaLabel: '搜索'},
      modal: {noResultsText: '没有结果', resetButtonTitle: '重置搜索', displayDetails: '显示详细列表', footer: {selectText: '选择', navigateText: '导航', closeText: '关闭'}}
    }}}}},
    socialLinks: [{icon: 'github', link: 'https://github.com/wangdiandao/widget-workshop-dev'}]
  }
});
