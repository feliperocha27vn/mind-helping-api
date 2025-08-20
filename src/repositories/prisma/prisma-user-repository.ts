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
}
