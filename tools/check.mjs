import {readFile, readdir, lstat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {englishDeclarations, englishProtocol} from './sdk-english.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');
const json = async file => JSON.parse(await read(file));
const exists = async file => { await lstat(path.join(root, file)); };
const walk = async directory => {
  const result = [];
  for (const item of await readdir(path.join(root, directory), {withFileTypes: true})) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const name = `${directory}/${item.name}`;
    assert(!item.isSymbolicLink(), `Symlink not allowed: ${name}`);
    result.push(...(item.isDirectory() ? await walk(name) : [name]));
  }
  return result;
};
const portable = await json('plugin.json');
assert.equal(portable.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
for (const file of ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json']) {
  const manifest = await json(file);
  assert.equal(manifest.name, portable.name);
  assert.equal(manifest.version, portable.version);
}
const codexMarket = await json('.agents/plugins/marketplace.json');
const claudeMarket = await json('.claude-plugin/marketplace.json');
assert.equal(codexMarket.plugins[0].source.path, './');
assert.equal(claudeMarket.plugins[0].source, './');
assert.equal(codexMarket.plugins[0].name, portable.name);
assert.equal(claudeMarket.plugins[0].name, portable.name);
const snapshot = await json('host-snapshot.json');
for (const file of snapshot.files) {
  const bytes = await readFile(path.join(root, file.destination));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `Snapshot changed: ${file.destination}`);
}
assert.equal(await read('docs/public/sdk/widget-host.en.d.ts'), englishDeclarations(await read('docs/public/sdk/widget-host.d.ts')));
assert.equal(await read('docs/public/sdk/protocol.en.json'), englishProtocol(await read('docs/public/sdk/protocol.json')));
assert.deepEqual(await json('docs/public/sdk/protocol.en.json'), await json('docs/public/sdk/protocol.json'));
for (const file of (await walk('docs/en')).filter(file => file.endsWith('.md'))) {
  const text = await read(file);
  assert(!/\p{Script=Han}/u.test(text), `English required: ${file}`);
  for (const match of text.matchAll(/^<<<\s+(\S+)/gm)) {
    const included = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    assert(!/\p{Script=Han}/u.test(await read(included)), `English snippet required: ${file} -> ${included}`);
  }
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+\.md)(?:#[^)]*)?\)/g)) {
    if (/^https?:/.test(match[1])) continue;
    const linked = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    assert(linked.startsWith('docs/en/'), `English page links outside its language: ${file} -> ${linked}`);
  }
}
let skills = 0;
for (const file of await walk('skills')) {
  if (!file.endsWith('/SKILL.md')) continue;
  const text = await read(file);
  assert(/^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/.test(text), `Invalid frontmatter: ${file}`);
  skills++;
}
assert.equal(skills, 2, 'Keep development and examples as the two shared Skills.');
// 检查引用文件存在；站点构建继续校验 VitePress 页面链接。
for (const directory of ['docs', 'skills']) for (const file of await walk(directory)) {
  if (!file.endsWith('.md')) continue;
  const text = (await read(file)).replace(/```[\s\S]*?```/g, '');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    const location = target.startsWith('/')
      ? path.posix.join('docs/public', target)
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), target));
    assert(!location.startsWith('../'), `Reference escapes package: ${file}`);
    await exists(location);
  }
}
const capabilities = new Set(['external.open', 'location', 'notifications', 'clipboard', 'directory.write', 'screen.capture']);
const ids = new Set();
let examples = 0;
for (const directory of await readdir(path.join(root, 'examples'), {withFileTypes: true})) {
  if (!directory.isDirectory()) continue;
  const base = `examples/${directory.name}`;
  const manifest = await json(`${base}/manifest.json`);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.hostApiMajor, 1);
  assert.equal(manifest.kind, 'widget');
  assert(!ids.has(manifest.widgetId), 'Duplicate widgetId');
  ids.add(manifest.widgetId);
  for (const capability of manifest.capabilities) assert(capabilities.has(capability), `Unknown capability: ${capability}`);
  await exists(`${base}/${manifest.entry ?? 'index.html'}`);
  for (const file of await walk(base)) {
    assert(!/\/(?:widget-host\.(?:js|d\.ts)|protocol\.json)$/i.test(file), `SDK must not be packaged: ${file}`);
    if (file.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--check', path.join(root, file)], {encoding: 'utf8'});
      assert.equal(result.status, 0, result.stderr);
    }
  }
  examples++;
}
const compiler = spawnSync(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '-p', path.join(root, 'tools/tsconfig.json')], {encoding: 'utf8'});
assert.equal(compiler.status, 0, compiler.stdout + compiler.stderr);
const tests = spawnSync(process.execPath, ['--test', path.join(root, 'tools/feed.test.mjs')], {encoding: 'utf8'});
assert.equal(tests.status, 0, tests.stdout + tests.stderr);
for (const file of ['CONTRIBUTING.md', 'THIRD_PARTY_NOTICES.md', ...await walk('skills')]) {
  assert(!/[\u3400-\u9fff]/u.test(await read(file)), `English required: ${file}`);
}
for (const file of (await walk('docs')).filter(file => file.endsWith('.md') && !file.startsWith('docs/en/'))) {
  await exists(file.replace('docs/', 'docs/en/'));
}
try { await exists('CLAUDE.md'); throw new Error('Do not distribute CLAUDE.md.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
console.log(`Checked ${snapshot.files.length} snapshot files, ${skills} skills, ${examples} example packages, references, JS syntax and SDK types.`);
console.log('Static checks do not replace host package validation or real WebView/device tests.');
