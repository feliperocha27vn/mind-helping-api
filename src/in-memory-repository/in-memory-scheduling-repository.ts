import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { Prisma, Scheduling } from '@prisma/client'
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
}
