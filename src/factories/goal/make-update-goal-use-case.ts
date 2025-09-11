import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { UpdateGoalUseCase } from '@/use-cases/goal/update'

export function makeUpdateGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const updateGoalUseCase = new UpdateGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  )

  return updateGoalUseCase
}
