import type { FeelingsRepository } from '@/repositories/feelings-repository'
import type { FeelingsUser, Prisma } from '@prisma/client'
import { isWithinInterval } from 'date-fns'
import { randomUUID } from 'node:crypto'

export class InMemoryFeelingsRepository implements FeelingsRepository {
  public items: FeelingsUser[] = []

  async create(data: Prisma.FeelingsUserUncheckedCreateInput) {
    const feeling = {
      id: data.id ?? randomUUID(),
      description: data.description,
      motive: data.motive ?? null,
      userPersonId: data.userPersonId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(feeling)

    return feeling
  }

  async getLastFeelingsByUserId(userId: string) {
    const feelings = this.items.filter(item => item.userPersonId === userId)
    const lastFeeling = feelings[feelings.length - 1]

    if (!lastFeeling) {
      return null
    }

    return lastFeeling
  }

  async getFeelingsByDay(userId: string, day: Date) {
    // Apenas filtra pelos dados recebidos - sem lógica de validação
    const startDay = new Date(day)
    startDay.setUTCHours(0, 0, 0, 0)

    const endDay = new Date(day)
    endDay.setUTCHours(23, 59, 59, 999)

    const feelingByDay = this.items.filter(item => {
      const userMatch = item.userPersonId === userId
      const dateInRange = isWithinInterval(item.createdAt, {
        start: startDay,
        end: endDay,
      })

      return userMatch && dateInRange
    })

    return feelingByDay
  }
}
