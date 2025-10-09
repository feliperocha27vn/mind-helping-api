import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetUserByIdUseCase } from '@/use-cases/person/user/get-user-by-id'

export function makeGetUserByIdUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(
    prismaPersonRepository,
    prismaUserRepository
  )

  return getUserByIdUseCase
}
