import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { DeleteGoalUseCase } from '@/use-cases/goal/delete'

export function makeDeleteGoalUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const personRepository = new PrismaPersonRepository()
  const deleteGoalUseCase = new DeleteGoalUseCase(
    prismaGoalRepository,
    personRepository
  )

  return deleteGoalUseCase
}
