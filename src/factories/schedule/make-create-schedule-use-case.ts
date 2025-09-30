import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { CreateScheduleUseCase } from '@/use-cases/schedule/create'

export function makeCreateScheduleUseCase() {
  const prismaScheduleRepository = new PrismaScheduleRepository()
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const createScheduleUseCase = new CreateScheduleUseCase(
    prismaScheduleRepository,
    prismaHourlyRepository,
    prismaProfessionalRepository
  )

  return createScheduleUseCase
}
