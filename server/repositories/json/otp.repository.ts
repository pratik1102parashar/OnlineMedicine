import { STORAGE_FILES } from '../../../config/app'
import type { OTPRecord } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class OtpRepository extends BaseJsonRepository<OTPRecord> {
  constructor() {
    super(STORAGE_FILES.otp, [])
  }

  async findByPhone(phone: string) {
    const records = await this.findAll()
    return records.find((record) => record.phone === phone) ?? null
  }

  async upsert(record: OTPRecord) {
    const records = await this.findAll()
    const next = records.filter((entry) => entry.phone !== record.phone)
    next.push(record)
    await this.saveAll(next)
  }

  async remove(phone: string) {
    const records = await this.findAll()
    await this.saveAll(records.filter((record) => record.phone !== phone))
  }
}

export const otpRepository = new OtpRepository()
