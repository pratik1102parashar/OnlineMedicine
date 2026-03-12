import { defineNitroPlugin } from 'nitropack/runtime'
import { ensureStorageFiles } from '../utils/storage'

export default defineNitroPlugin(async () => {
  await ensureStorageFiles()
})
