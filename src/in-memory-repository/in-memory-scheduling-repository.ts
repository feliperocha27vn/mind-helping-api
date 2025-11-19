import { randomUUID } from 'node:crypto'
import type { Prisma, Scheduling } from '@prisma/client'
import { getMonth, isWithinInterval } from 'date-fns'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

export class InMemorySchedulingRepository implements SchedulingRepository {
  public items: Scheduling[] = []

  async create(data: Prisma.SchedulingUncheckedCreateInput) {
    const scheduling: Scheduling = {
      id: data.id ?? randomUUID(),
      hourlyId: data.hourlyId,
      professionalPersonId: data.professionalPersonId,
      userPersonId: data.userPersonId,
      isCanceled: data.isCanceled ?? false,
      onFinishedConsultation: data.onFinishedConsultation ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(scheduling)

    return scheduling
  }

  async getByUserId(userId: string) {
    const schedulings = this.items.filter(item => item.userPersonId === userId)

    const scheduling = schedulings[schedulings.length - 1] ?? null

    if (!scheduling) {
      return null
    }

    return scheduling
  }

  async getPatientsByProfessionalId(professionalId: string) {
    const schedulings = this.items.filter(
      item => item.professionalPersonId === professionalId
    )

    if (schedulings.length === 0) {
      return null
    }

    const numberUniquePatients = new Set(
      schedulings.map(item => item.userPersonId)
    ).size

    return numberUniquePatients
  }

  async getSchedulingsByDate(
    professionalId: string,
    startDay: Date,
    endDay: Date
  ) {
    const schedulingsByDate = this.items.filter(item => {
      const professionalMatch = item.professionalPersonId === professionalId
      const dateInRange = isWithinInterval(item.createdAt, {
        start: startDay,
        end: endDay,
      })
      const notCanceled = !item.isCanceled

      return professionalMatch && dateInRange && notCanceled
    })

    const schedulingsCount = schedulingsByDate.length

    return schedulingsCount
  }

  async getShedulingsCancelByProfessionalId(
    professionalId: string,
    startDay: Date,
    endDay: Date
  ) {
    const schedulingsByDate = this.items.filter(item => {
      const professionalMatch = item.professionalPersonId === professionalId
      const dateInRange = isWithinInterval(item.createdAt, {
        start: startDay,
        end: endDay,
      })

      return professionalMatch && dateInRange
    })

    if (schedulingsByDate.length === 0) {
      return null
    }

    const numberCancelSchedulings = schedulingsByDate.filter(
      item => item.isCanceled === true
    ).length

    return numberCancelSchedulings
  }

  async setCancelScheduling(schedulingId: string) {
    const scheduling = this.items.find(item => item.id === schedulingId)

    if (!scheduling) {
      return null
    }

    scheduling.isCanceled = true
    scheduling.updatedAt = new Date()

    return scheduling
  }

  async getById(schedulingId: string) {
    const scheduling = this.items.find(item => item.id === schedulingId)

    if (!scheduling) {
      return null
    }

    return scheduling
  }

  async onFinishedConsultation(schedulingId: string): Promise<void> {
    const scheduling = this.items.find(item => item.id === schedulingId)

    if (!scheduling) {
      return
    }

    scheduling.onFinishedConsultation = true
    scheduling.updatedAt = new Date()
  }

  async getByHourlyId(hourlyId: string) {
    const schedulings = this.items.filter(item => item.hourlyId === hourlyId)

    return schedulings
  }

  async getSchedulingsByMonth(professionalId: string, month: number) {
    const schedulings = this.items.filter(
      item =>
        item.professionalPersonId === professionalId &&
        getMonth(item.createdAt) === month &&
        item.onFinishedConsultation === true
    )

    return schedulings.length
  }

  async fetchSchedulingsByProfessionalId(professionalId: string, page: number) {
    const schedulings = this.items.filter(
      item => item.professionalPersonId === professionalId
    )

    const pageStart = (page - 1) * 10
    const pageEnd = pageStart + 10

    return schedulings.slice(pageStart, pageEnd)
  }

  async fetchPatientsByUserId(userId: string) {
    const schedulings = this.items.filter(item => item.userPersonId === userId && item.onFinishedConsultation === true)

    return schedulings
  }
}
