import { PrismaFeelingsRepository } from '@/repositories/prisma/prisma-feelings-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { CreateFeelingUserUseCase } from '@/use-cases/feelings-user/create'

export function makeCreateFeelingUserUseCase() {
  const prismaFeelingsRepository = new PrismaFeelingsRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const createFeelingUserUseCase = new CreateFeelingUserUseCase(
    prismaFeelingsRepository,
    prismaPersonRepository
  )

  return createFeelingUserUseCase
}
