import { PrismaFeelingsRepository } from '@/repositories/prisma/prisma-feelings-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetFeelingsByDateUseCase } from '@/use-cases/feelings-user/get-feelings-by-date'

export function makeGetFeelingsByDateUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const prismaFeelingsRepository = new PrismaFeelingsRepository()
  const getFeelingsByDateUseCase = new GetFeelingsByDateUseCase(
    prismaPersonRepository,
    prismaUserRepository,
    prismaFeelingsRepository
  )

  return getFeelingsByDateUseCase
}
