import { PrismaDailyRepository } from '@/repositories/prisma/prisma-daily-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetDailyByIdUseCase } from '@/use-cases/dailys/get-daily-by-id'

export function makeGetDailyByIdUseCase() {
  const prismaDailyRepository = new PrismaDailyRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const getDailyByIdUseCase = new GetDailyByIdUseCase(
    prismaDailyRepository,
    prismaUserRepository
  )

  return getDailyByIdUseCase
}
