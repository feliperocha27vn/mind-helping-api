import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { ExecuteGoalUseCase } from '@/use-cases/goal/execute-goal-use-case'

export function makeExecuteGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const executeGoalUseCase = new ExecuteGoalUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  )

  return executeGoalUseCase
}
