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

  async getById(personId: string) {
    const user = this.items.find(item => item.person_id === personId)

    if (!user) {
      return null
    }

    return user
  }

  async update(userId: string, data: Prisma.UserUncheckedUpdateInput) {
    const existingUser = this.items.find(item => item.person_id === userId)

    if (!existingUser) {
      return null
    }

    const updatedUser = {
      ...existingUser,
      gender: (data.gender as string) ?? existingUser.gender,
    }

    const userIndex = this.items.findIndex(item => item.person_id === userId)

    this.items[userIndex] = updatedUser

    return updatedUser
  }
}
