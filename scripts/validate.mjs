import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const plugin = await readJson('.claude-plugin/plugin.json');
const marketplace = await readJson('.claude-plugin/marketplace.json');
const mcp = await readJson('.mcp.json');
const cursorMcp = await readJson('mcp.json');
const cursor = await readJson('.cursor-plugin/plugin.json');
const grok = await readJson('.grok-plugin/plugin.json');

assert.equal(plugin.name, 'eryx');
assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
assert.equal(plugin.license, 'MIT');
assert.equal(plugin.repository, 'https://github.com/novolgit/eryx-mcp-plugin');
assert.ok(plugin.description.length > 0);
assert.ok(Array.isArray(plugin.keywords));
assert.equal(plugin.author.email, 'business@eryx.digital');
for (const key of ['homepage', 'repository']) {
  assert.equal(new URL(plugin[key]).protocol, 'https:');
}
// Rely on the standard root .mcp.json; never register the same server twice.
assert.ok(!Object.hasOwn(plugin, 'mcpServers'));

assert.equal(marketplace.name, 'eryx-plugins');
assert.ok(marketplace.description.length > 0);
assert.ok(marketplace.owner.name.length > 0);
assert.equal(marketplace.plugins.length, 1);
const entry = marketplace.plugins[0];
assert.equal(entry.name, plugin.name);
assert.equal(entry.description, plugin.description);
assert.equal(entry.source, './');
assert.equal(entry.strict ?? true, true);
// Keep the version in plugin.json as the single authority.
assert.ok(!Object.hasOwn(entry, 'version'));
assert.equal(resolve(root, entry.source), resolve(root));
await access(resolve(root, entry.source, '.claude-plugin/plugin.json'));

const endpoint = 'https://eryx-mcp.groundforr.workers.dev/mcp';
assert.deepEqual(mcp, { mcpServers: { eryx: { type: 'http', url: endpoint } } });
assert.deepEqual(cursorMcp, { mcpServers: { eryx: { url: endpoint } } });
for (const manifest of [cursor, grok]) {
  assert.equal(manifest.name, plugin.name);
  const logo = resolve(root, manifest.logo);
  assert.ok(logo.startsWith(resolve(root) + sep));
  await access(logo);
}
await access(resolve(root, 'LICENSE'));

console.log('PASS: Claude manifest, marketplace root resolution, shared HTTP endpoint, credential-free config, and Cursor/Grok assets.');
console.log('Static checks only: OAuth, tool execution, and directory acceptance are not tested.');
