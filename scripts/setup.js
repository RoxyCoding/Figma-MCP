import { randomBytes } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const env = fileURLToPath(new URL('../.env', import.meta.url));
if (!existsSync(env)) {
  writeFileSync(env, `FIGMA_BRIDGE_TOKEN=${randomBytes(32).toString('hex')}\nFIGMA_BRIDGE_PORT=3055\nFIGMA_ACCESS_TOKEN=\n`, { flag: 'wx', mode: 0o600 });
}
await import('./build-plugin.js');
writeFileSync(new URL('../mcp.local.json', import.meta.url), JSON.stringify({
  mcpServers: { 'local-figma': {
    command: process.execPath,
    args: [`--env-file=${env}`, fileURLToPath(new URL('../src/index.js', import.meta.url))]
  } }
}, null, 2) + '\n');
console.log(`Setup complete: ${root}mcp.local.json (token is stored in .env)`);
