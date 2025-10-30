import { PrismaCvvCallsRepository } from '@/repositories/prisma/prisma-cvv-calls-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetCvvCallsByPersonIdUseCase } from '@/use-cases/cvv-calls/get-cvv-calls-by-person-id-use-case'

export function makeGetCvvCallsByPersonIdUseCase() {
  const prismaCvvCallsRepository = new PrismaCvvCallsRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const getCvvCallsByPersonIdUseCase = new GetCvvCallsByPersonIdUseCase(
    prismaCvvCallsRepository,
    prismaUserRepository
  )

  return getCvvCallsByPersonIdUseCase
}
