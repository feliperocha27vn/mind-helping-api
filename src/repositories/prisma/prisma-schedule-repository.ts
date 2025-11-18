import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { ScheduleRepository } from '../schedule-repository'

export class PrismaScheduleRepository implements ScheduleRepository {
  async create(data: Prisma.ScheduleUncheckedCreateInput) {
    const schedule = await prisma.schedule.create({
      data,
    })

    return schedule
  }

  async getById(id: string) {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    })

    return schedule
  }

  async fetchMany(professionalPersonId: string) {
    const schedules = await prisma.schedule.findMany({
      where: { professionalPersonId },
    })

    return schedules
  }

  async delete(id: string) {
    await prisma.schedule.delete({
      where: { id },
    })
  }
}
