import type { Repository } from '../interfaces/repository'
import { readStorageFile, writeStorageFile } from '../../utils/storage'

export abstract class BaseJsonRepository<T> implements Repository<T> {
  constructor(private readonly fileName: string, private readonly fallback: T[]) {}

  async findAll() {
    return readStorageFile<T[]>(this.fileName, this.fallback)
  }

  async saveAll(items: T[]) {
    await writeStorageFile(this.fileName, items)
  }
}
