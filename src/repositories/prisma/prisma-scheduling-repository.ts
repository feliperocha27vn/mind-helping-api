import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { SchedulingRepository } from '../scheduling-repository'

export class PrismaSchedulingRepository implements SchedulingRepository {
  async create(data: Prisma.SchedulingUncheckedCreateInput) {
    const scheduling = await prisma.scheduling.create({
      data,
    })

    return scheduling
  }
}
