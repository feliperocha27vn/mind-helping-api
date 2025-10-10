import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { Prisma, Scheduling } from '@prisma/client'
import { isWithinInterval } from 'date-fns'
import { randomUUID } from 'node:crypto'

export class InMemorySchedulingRepository implements SchedulingRepository {
  public items: Scheduling[] = []

  async create(data: Prisma.SchedulingUncheckedCreateInput) {
    const scheduling = {
      id: data.id ?? randomUUID(),
      hourlyId: data.hourlyId,
      professionalPersonId: data.professionalPersonId,
      userPersonId: data.userPersonId,
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

      return professionalMatch && dateInRange
    })

    const schedulingsCount = schedulingsByDate.length

    if (schedulingsCount === 0) {
      return null
    }

    return schedulingsCount
  }
}
