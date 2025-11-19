import type { Prisma, Scheduling } from '@prisma/client'
import { getMonth } from 'date-fns'
import { prisma } from '@/lib/prisma'
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
        isCanceled: false,
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

  async getByHourlyId(hourlyId: string) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        hourlyId,
      },
    })

    return schedulings
  }

  async getSchedulingsByMonth(professionalId: string, month: number) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        professionalPersonId: professionalId,
      },
    })

    const schedulingsByMonth = schedulings.filter(scheduling => {
      const schedulingDate = new Date(scheduling.createdAt)
      return getMonth(schedulingDate) === month
    })

    return schedulingsByMonth.length
  }

  async fetchSchedulingsByProfessionalId(professionalId: string, page: number) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        professionalPersonId: professionalId,
        onFinishedConsultation: true,
      },
      skip: (page - 1) * 10,
      take: 10,
    })

    return schedulings
  }

  async fetchPatientsByUserId(userId: string) {
    const schedulings = await prisma.scheduling.findMany({
      where: {
        userPersonId: userId,
        onFinishedConsultation: true,
      },
    })

    return schedulings
  }
}
