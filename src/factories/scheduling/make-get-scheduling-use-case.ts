import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetSchedulingUseCase } from '@/use-cases/scheduling/get-by-user-id'

export function makeGetSchedulingUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const getSchedulingUseCase = new GetSchedulingUseCase(
    prismaSchedulingRepository,
    prismaPersonRepository,
    prismaHourlyRepository
  )

  return getSchedulingUseCase
}
