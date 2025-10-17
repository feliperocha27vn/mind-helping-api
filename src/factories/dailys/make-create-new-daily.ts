import { PrismaDailyRepository } from '@/repositories/prisma/prisma-daily-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreateNewDaily } from '@/use-cases/dailys/create-new-daily'

export function makeCreateNewDailyUseCase() {
  const prismaDailyRepository = new PrismaDailyRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const createNewDailyUseCase = new CreateNewDaily(
    prismaDailyRepository,
    prismaUserRepository
  )

  return createNewDailyUseCase
}
