import type { CvvCallsRepository } from '@/repositories/cvv-calls-repository'
import type { CvvCalls, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryCvvCallsRepository implements CvvCallsRepository {
  items: CvvCalls[] = []

  async create(data: Prisma.CvvCallsUncheckedCreateInput) {
    const cvvCall = {
      id: data.id ?? randomUUID(),
      dateCalled: new Date(data.dateCalled),
      timeCalled: data.timeCalled,
      userPersonId: data.userPersonId,
    }

    this.items.push(cvvCall)

    return cvvCall
  }

  async getByPersonId(personId: string) {
    const cvvCalls = this.items.filter(
      cvvCalls => cvvCalls.userPersonId === personId
    )

    if (!cvvCalls) {
      return null
    }

    return cvvCalls
  }
}
