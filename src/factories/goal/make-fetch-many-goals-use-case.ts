import { PrismaGoalRepository } from '@/repositories/prisma/prisma-goal-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { FetchManyGoalsUseCase } from '@/use-cases/goal/fetch-many'

export function makeFetchManyGoalsUseCase() {
  const prismaGoalRepository = new PrismaGoalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const fetchManyGoalsUseCase = new FetchManyGoalsUseCase(
    prismaGoalRepository,
    prismaPersonRepository
  )

  return fetchManyGoalsUseCase
}
