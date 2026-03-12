export interface Repository<T> {
  findAll(): Promise<T[]>
  saveAll(items: T[]): Promise<void>
}
