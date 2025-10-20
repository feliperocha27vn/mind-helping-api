import type { CvvCallsRepository } from '@/repositories/cvv-calls-repository'
import type { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryCvvCallsRepository implements CvvCallsRepository {
  async create(data: Prisma.CvvCallsUncheckedCreateInput) {
    const cvvCall = {
      id: data.id ?? randomUUID(),
      dateCalled: new Date(data.dateCalled),
      timeCalled: data.timeCalled,
      userPersonId: data.userPersonId,
    }

    return cvvCall
  }
}
