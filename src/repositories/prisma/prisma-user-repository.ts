import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { UserRepository } from '../user-repository'

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async getById(personId: string) {
    const user = await prisma.user.findUnique({
      where: { person_id: personId },
    })

    return user
  }

  async update(userId: string, data: Prisma.UserUncheckedUpdateInput) {
    const userUpdated = await prisma.user.update({
      where: { person_id: userId },
      data,
    })

    console.log(userUpdated)

    return userUpdated
  }
}
