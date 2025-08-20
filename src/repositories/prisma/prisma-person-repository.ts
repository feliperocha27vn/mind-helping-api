import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { PersonRepository } from '../person-repository'

export class PrismaPersonRepository implements PersonRepository {
  async create(data: Prisma.PersonUncheckedCreateInput) {
    const person = await prisma.person.create({
      data,
    })

    return person
  }

  async findById(personId: string) {
    const person = await prisma.person.findUnique({
      where: {
        id: personId,
      },
    })

    return person
  }

  async findByEmail(email: string) {
    const person = await prisma.person.findUnique({
      where: {
        email,
      },
    })

    return person
  }
}
