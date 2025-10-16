import type { DailyRepository } from '@/repositories/daily-repository'
import type { Daily, Prisma } from '@prisma/client'
import { isWithinInterval } from 'date-fns'
import { randomUUID } from 'node:crypto'

export class InMemoryDailyRepository implements DailyRepository {
  private items: Daily[] = []

  async create(data: Prisma.DailyUncheckedCreateInput) {
    const daily = {
      id: data.id ?? randomUUID(),
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userPersonId: data.userPersonId,
    }

    this.items.push(daily)

    return daily
  }

  async fetchDailysByDateRangeAndUserId(
    userId: string,
    startDay: Date,
    endDay: Date
  ) {
    const dailysByDate = this.items.filter(item => {
      const professionalMatch = item.userPersonId === userId
      const dateInRange = isWithinInterval(item.createdAt, {
        start: startDay,
        end: endDay,
      })

      return professionalMatch && dateInRange
    })

    return dailysByDate
  }

  async deleteById(dailyId: string, userId: string) {
    const daily = this.items.find(
      daily => daily.id === dailyId && daily.userPersonId === userId
    )

    if (!daily) {
      return
    }

    this.items.splice(this.items.indexOf(daily), 1)
  }

  async getById(dailyId: string, userId: string) {
    const daily = this.items.find(
      daily => daily.id === dailyId && daily.userPersonId === userId
    )

    if (!daily) {
      return null
    }

    return daily
  }
}
