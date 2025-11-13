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
        onFinishedConsultation: true,
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

  async getShedulingsCancelByProfessionalId(professionalId: string) {
    const schedulingsCancel = await prisma.scheduling.count({
      where: {
        professionalPersonId: professionalId,
        isCanceled: true,
      },
    })

    return schedulingsCancel
  }

  async setCancelScheduling(schedulingId: string) {
    const scheduling = await prisma.scheduling.update({
      where: { id: schedulingId },
      data: { isCanceled: true },
    })

    return scheduling
  }

  async fetchSchedulingByProfessionalId(
    professionalId: string,
    startDay: Date,
    endDay: Date,
    page: number
  ) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        professionalPersonId: professionalId,
        createdAt: {
          gte: startDay,
          lte: endDay,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return schedulings
  }

  async getById(schedulingId: string) {
    const scheduling = await prisma.scheduling.findUnique({
      where: { id: schedulingId },
    })

    return scheduling
  }

  async onFinishedConsultation(schedulingId: string) {
    await prisma.scheduling.update({
      where: { id: schedulingId },
      data: { onFinishedConsultation: true },
    })
  }
}
