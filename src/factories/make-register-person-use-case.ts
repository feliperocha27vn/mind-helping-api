import { PrismaPersonRepository } from '../repositories/prisma/prisma-person-repository'
import { RegisterUseCase } from '../use-cases/person/register'

export function makePersonUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const registerUseCase = new RegisterUseCase(prismaPersonRepository)

  return registerUseCase
}
