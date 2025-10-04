import { PrismaFeelingsRepository } from '@/repositories/prisma/prisma-feelings-repository'
import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { GetMeUserUseCase } from '@/use-cases/person/get-me-user'

export function makeGetMeUserUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaFeelingsRepository = new PrismaFeelingsRepository()
  const prismaGoalRepository = new PrismaGoalRepository()
  const getMeUserUseCase = new GetMeUserUseCase(
    prismaPersonRepository,
    prismaFeelingsRepository,
    prismaGoalRepository
  )

  return getMeUserUseCase
}
