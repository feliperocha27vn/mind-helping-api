import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { AddCounterUseCase } from '@/use-cases/goal/add-counter'

export function makeAddCounterGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const addCounterGoalUseCase = new AddCounterUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  )

  return addCounterGoalUseCase
}
