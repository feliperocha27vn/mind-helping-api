import type { Prisma, User } from '@prisma/client'

export interface UserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  getById(personId: string): Promise<User | null>
}
