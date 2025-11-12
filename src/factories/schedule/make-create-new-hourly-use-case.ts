import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { CreateNewHourlyUseCase } from '@/use-cases/hourlies/create-new-hourly-use-case'

export function makeCreateNewHourlyUseCase() {
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const prismaScheduleRepository = new PrismaScheduleRepository()
  const createNewHourlyUseCase = new CreateNewHourlyUseCase(
    prismaHourlyRepository,
    prismaScheduleRepository
  )

  return createNewHourlyUseCase
}
