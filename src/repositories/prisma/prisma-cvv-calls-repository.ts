import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { CvvCallsRepository } from '../cvv-calls-repository'

export class PrismaCvvCallsRepository implements CvvCallsRepository {
  async create(data: Prisma.CvvCallsUncheckedCreateInput) {
    const cvvCall = await prisma.cvvCalls.create({
      data,
    })

    return cvvCall
  }

  async getByPersonId(personId: string) {
    const cvvCalls = await prisma.cvvCalls.findMany({
      where: {
        userPersonId: personId,
      },
    })

    return cvvCalls
  }
}
