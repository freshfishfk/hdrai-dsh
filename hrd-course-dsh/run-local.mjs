import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'
import { hrdAiRoot } from './hrd-ai-path.mjs'

const checkout = fileURLToPath(new URL('../', import.meta.url))
const bundle = fileURLToPath(new URL('./', import.meta.url))
const envFile = join(hrdAiRoot, '.env.local')
const keys = ['DEEPSEEK_API_KEY', 'GETNOTE_API_KEY', 'GETNOTE_CLIENT_ID']
const moduleKeys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'].map(number => `GETNOTE_KNOWLEDGE_ID_MODULE_${number}`)
const appEnv = parseEnv(readFileSync(envFile, 'utf8'))
const env = {
  ...process.env,
  HRD_AI_ROOT: hrdAiRoot,
  DSH_HOME: process.env.DSH_HOME || fileURLToPath(new URL('./.local/', import.meta.url)),
}
for (const key of keys) {
  const value = appEnv[key]?.trim()
  if (!value) throw new Error(`HRD-AI development configuration is missing ${key}`)
  env[key] = value
}
for (const key of moduleKeys) {
  const value = appEnv[key]?.trim()
  if (value) env[key] = value
  else delete env[key]
}

// The native DSH route speaks the official DeepSeek Messages protocol.
delete env.DEEPSEEK_BASE_URL

const cli = ['--import', 'tsx/esm', 'apps/cli/src/bin.ts']
const command = process.argv[2]
if (command !== undefined && command !== 'install') throw new Error('Expected install or no argument.')
if (command === 'install') {
  await run([...cli, 'web', '--dump-config'], ['inherit', 'ignore', 'inherit'])
  await run([...cli, 'plugin', '--profile', 'web', 'add', bundle], 'inherit')
} else {
  await run([...cli, 'web', '--host', '127.0.0.1', '--port', '3081', '--no-open'], 'inherit')
}

function run(args, stdio) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: checkout, env, stdio })
    const stop = signal => child.kill(signal)
    const interrupt = () => stop('SIGINT')
    const terminate = () => stop('SIGTERM')
    process.once('SIGINT', interrupt)
    process.once('SIGTERM', terminate)
    child.once('error', reject)
    child.once('close', (code, signal) => {
      process.off('SIGINT', interrupt)
      process.off('SIGTERM', terminate)
      if (code === 0 || (command === undefined && (signal === 'SIGTERM' || signal === 'SIGINT' || code === 130))) {
        resolve()
      } else {
        reject(new Error(`DSH exited with ${code ?? signal}`))
      }
    })
  })
}
