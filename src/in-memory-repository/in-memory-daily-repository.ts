import type { DailyRepository } from '@/repositories/daily-repository'
import type { Daily, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryDailyRepository implements DailyRepository {
  private dailys: Daily[] = []

  async create(data: Prisma.DailyUncheckedCreateInput) {
    const daily = {
      id: data.id ?? randomUUID(),
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userPersonId: data.userPersonId,
    }

    this.dailys.push(daily)

    return daily
  }
}
