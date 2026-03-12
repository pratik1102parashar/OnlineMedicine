import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const LOG_DIR = join(process.cwd(), 'logs')

export async function logEvent(channel: string, event: string, payload: Record<string, unknown>) {
  await mkdir(LOG_DIR, { recursive: true })
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), channel, event, payload })
  await appendFile(join(LOG_DIR, `${channel}.log`), `${entry}\n`, 'utf8')
}
