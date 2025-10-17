import { PrismaDailyRepository } from '@/repositories/prisma/prisma-daily-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { FetchDailysByDateRangeAndUserIdUseCase } from '@/use-cases/dailys/fetch-dailys-by-date-range-and-user-id'

export function makeFetchDailysByDateRangeAndUserIdUseCase() {
  const prismaDailyRepository = new PrismaDailyRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const fetchDailysByDateRangeAndUserIdUseCase =
    new FetchDailysByDateRangeAndUserIdUseCase(
      prismaDailyRepository,
      prismaUserRepository
    )

  return fetchDailysByDateRangeAndUserIdUseCase
}
