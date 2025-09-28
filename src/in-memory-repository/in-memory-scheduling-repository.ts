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
    }

    this.items.push(scheduling)

    return scheduling
  }
}
