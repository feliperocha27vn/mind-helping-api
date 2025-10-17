import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { UpdateUserUseCase } from '@/use-cases/person/user/update-user'

export function makeUpdateUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const updateUserUseCase = new UpdateUserUseCase(
    prismaUserRepository,
    prismaPersonRepository
  )

  return updateUserUseCase
}
