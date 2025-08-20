import type { UserRepository } from '@/repositories/user-repository'
import type { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = {
      person_id: data.person_id ?? randomUUID(),
      gender: data.gender,
    }

    this.items.push(user)

    return user
  }
}
