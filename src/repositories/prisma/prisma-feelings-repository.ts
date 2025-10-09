import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { FeelingsRepository } from '../feelings-repository'

export class PrismaFeelingsRepository implements FeelingsRepository {
  async create(data: Prisma.FeelingsUserUncheckedCreateInput) {
    const feeling = await prisma.feelingsUser.create({
      data,
    })

    return feeling
  }

  async getLastFeelingsByUserId(userId: string) {
    const feeling = await prisma.feelingsUser.findFirst({
      where: {
        userPersonId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return feeling
  }

  async getFeelingsByDate(userId: string, startDay: Date, endDay: Date) {
    const feelings = await prisma.feelingsUser.findMany({
      where: {
        userPersonId: userId,
        createdAt: {
          gte: startDay,
          lte: endDay,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return feelings
  }
}
