import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { SetCancelHourlyUseCase } from '@/use-cases/hourlies/set-cancel-hourly-use-case'

export function makeSetCancelHourlyUseCase() {
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const setCancelHourlyUseCase = new SetCancelHourlyUseCase(
    prismaHourlyRepository
  )

  return setCancelHourlyUseCase
}
