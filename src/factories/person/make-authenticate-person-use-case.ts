import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { AuthenticatePersonUseCase } from '@/use-cases/person/authenticate'

export function makeAuthenticatePersonUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const authenticatePersonUseCase = new AuthenticatePersonUseCase(
    prismaPersonRepository
  )

  return authenticatePersonUseCase
}
