import { PrismaFeelingsRepository } from '@/repositories/prisma/prisma-feelings-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetFeelingByDayUseCase } from '@/use-cases/feelings-user/get-feeling-by-day'

export function makeGetFeelingByDayUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const prismaFeelingsRepository = new PrismaFeelingsRepository()
  const getFeelingByDayUseCase = new GetFeelingByDayUseCase(
    prismaPersonRepository,
    prismaUserRepository,
    prismaFeelingsRepository
  )

  return getFeelingByDayUseCase
}
