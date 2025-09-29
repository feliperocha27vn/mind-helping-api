import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { FetchManyHourliesByScheduleIdUseCase } from '@/use-cases/hourlies/fetch-many-by-schedule-id'

export function makeFetchManyByScheduleIdUseCase() {
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const prismaScheduleRepository = new PrismaScheduleRepository()
  const fetchManyHourliesByScheduleIdUseCase =
    new FetchManyHourliesByScheduleIdUseCase(
      prismaHourlyRepository,
      prismaScheduleRepository
    )

  return fetchManyHourliesByScheduleIdUseCase
}
