import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreateSchedulingUseCase } from '@/use-cases/scheduling/create'

export function makeCreateSchedulingUseCase() {
  const primsaScheduleRepository = new PrismaScheduleRepository()
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const createSchedulingUseCase = new CreateSchedulingUseCase(
    primsaScheduleRepository,
    prismaSchedulingRepository,
    prismaHourlyRepository,
    prismaProfessionalRepository,
    prismaUserRepository
  )

  return createSchedulingUseCase
}
