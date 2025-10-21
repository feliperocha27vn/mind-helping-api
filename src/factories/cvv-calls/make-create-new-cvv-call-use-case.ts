import { PrismaCvvCallsRepository } from '@/repositories/prisma/prisma-cvv-calls-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreateNewCvvCallUseCase } from '@/use-cases/cvv-calls/create-new-cvv-call'

export function makeCreateNewCvvCallUseCase() {
  const prismaCvvCallsRepository = new PrismaCvvCallsRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const createNewCvvCallUseCase = new CreateNewCvvCallUseCase(
    prismaCvvCallsRepository,
    prismaUserRepository
  )

  return createNewCvvCallUseCase
}
