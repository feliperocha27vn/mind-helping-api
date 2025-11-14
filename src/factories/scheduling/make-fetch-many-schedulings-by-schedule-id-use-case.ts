import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { FetchManySchedulingsByScheduleIdUseCase } from '@/use-cases/scheduling/fetch-many-schedulings-by-schedule-id-use-case'

export function makeFetchManySchedulingsByScheduleIdUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const fetchManySchedulingsByScheduleIdUseCase =
    new FetchManySchedulingsByScheduleIdUseCase(
      prismaSchedulingRepository,
      prismaPersonRepository,
      prismaHourlyRepository
    )

  return fetchManySchedulingsByScheduleIdUseCase
}
