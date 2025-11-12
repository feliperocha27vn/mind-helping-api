import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { Schedule } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryScheduleRepository implements ScheduleRepository {
  private items: Schedule[] = []

  async create(data: Prisma.ScheduleUncheckedCreateInput) {
    const schedule = {
      id: data.id ?? randomUUID(),
      professionalPersonId: data.professionalPersonId ?? randomUUID(),
      initialTime: new Date(data.initialTime ?? new Date()),
      endTime: new Date(data.endTime ?? new Date()),
      interval: data.interval ?? 0,
      cancellationPolicy: data.cancellationPolicy,
      averageValue: new Prisma.Decimal(data.averageValue.toString()),
      observation: data.observation ?? '',
      isControlled: data.isControlled,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(schedule)

    return schedule
  }

  async getById(id: string) {
    const schedule = this.items.find(item => item.id === id)

    if (!schedule) {
      return null
    }

    return schedule
  }

  async fetchMany(professionalPersonId: string) {
    const schedules = this.items.filter(
      item => item.professionalPersonId === professionalPersonId
    )

    if (!schedules) {
      return null
    }

    return schedules
  }
}
