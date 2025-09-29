import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { DailyRepository } from '../daily-repository'

export class PrismaDailyRepository implements DailyRepository {
  async create(data: Prisma.DailyUncheckedCreateInput) {
    const daily = await prisma.daily.create({
      data,
    })

    return daily
  }
}
