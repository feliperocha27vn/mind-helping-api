import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { RegisterUserUseCase } from '@/use-cases/person/register-user'

export function makeRegisterUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const userUseCase = new RegisterUserUseCase(
    prismaUserRepository,
    prismaPersonRepository
  )

  return userUseCase
}
