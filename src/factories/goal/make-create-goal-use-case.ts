import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { CreateGoalUseCase } from '@/use-cases/goal/create'

export function makeCreateGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const createGoalUseCase = new CreateGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  )

  return createGoalUseCase
}
