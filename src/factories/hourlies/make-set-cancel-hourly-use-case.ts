import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { SetCancelHourlyUseCase } from '@/use-cases/hourlies/set-cancel-hourly-use-case'

export function makeSetCancelHourlyUseCase() {
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const setCancelHourlyUseCase = new SetCancelHourlyUseCase(
    prismaHourlyRepository,
    prismaSchedulingRepository
  )

  return setCancelHourlyUseCase
}
