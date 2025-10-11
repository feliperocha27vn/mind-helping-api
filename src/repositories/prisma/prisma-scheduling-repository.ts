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

  async getByUserId(userId: string) {
    const scheduling = await prisma.scheduling.findFirst({
      where: { userPersonId: userId },
      orderBy: { createdAt: 'desc' },
    })

    return scheduling
  }

  async getPatientsByProfessionalId(professionalId: string) {
    const patients = await prisma.scheduling.findMany({
      where: { professionalPersonId: professionalId },
      distinct: ['userPersonId'],
    })

    const numberPatients = patients.length

    return numberPatients
  }

  async getSchedulingsByDate(
    professionalId: string,
    startDay: Date,
    endDay: Date
  ) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        professionalPersonId: professionalId,
        createdAt: {
          gte: startDay,
          lte: endDay,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const schedulingsCount = schedulings.length

    if (schedulingsCount === 0) {
      return null
    }

    return schedulingsCount
  }
}
