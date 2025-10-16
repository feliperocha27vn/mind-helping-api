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

  async deleteById(dailyId: string, userId: string) {
    await prisma.daily.deleteMany({
      where: {
        id: dailyId,
        userPersonId: userId,
      },
    })
  }

  async fetchDailysByDateRangeAndUserId(
    userId: string,
    startDay: Date,
    endDay: Date
  ) {
    const dailys = await prisma.daily.findMany({
      where: {
        userPersonId: userId,
        createdAt: {
          gte: startDay,
          lte: endDay,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return dailys
  }

  async getById(dailyId: string, userId: string) {
    const daily = await prisma.daily.findUnique({
      where: {
        id: dailyId,
        userPersonId: userId,
      },
    })

    return daily
  }
}
