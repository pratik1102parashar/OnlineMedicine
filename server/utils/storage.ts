import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { STORAGE_FILES } from '../../config/app'

const STORAGE_DIR = join(process.cwd(), 'storage')

export async function ensureStorageFiles() {
  await mkdir(STORAGE_DIR, { recursive: true })
  const defaults: Record<string, unknown> = {
    [STORAGE_FILES.users]: [],
    [STORAGE_FILES.medicines]: [],
    [STORAGE_FILES.carts]: [],
    [STORAGE_FILES.orders]: [],
    [STORAGE_FILES.coupons]: [],
    [STORAGE_FILES.inventory]: [],
    [STORAGE_FILES.otp]: []
  }

  await Promise.all(Object.entries(defaults).map(async ([fileName, fallback]) => {
    const filePath = join(STORAGE_DIR, fileName)
    try {
      await readFile(filePath, 'utf8')
    } catch {
      await writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8')
    }
  }))
}

export async function readStorageFile<T>(fileName: string, fallback: T): Promise<T> {
  await ensureStorageFiles()
  const filePath = join(STORAGE_DIR, fileName)
  try {
    const contents = await readFile(filePath, 'utf8')
    return JSON.parse(contents) as T
  } catch {
    await writeStorageFile(fileName, fallback)
    return fallback
  }
}

export async function writeStorageFile<T>(fileName: string, value: T) {
  await ensureStorageFiles()
  const filePath = join(STORAGE_DIR, fileName)
  await writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}
