import { PrismaDailyRepository } from '@/repositories/prisma/prisma-daily-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { DeleteDailyByIdUseCase } from '@/use-cases/dailys/delete-daily-by-id'

export function makeDeleteDailyByIdUseCase() {
  const prismaDailyRepository = new PrismaDailyRepository()
  const prismaUserRepository = new PrismaUserRepository()
  const deleteDailyByIdUseCase = new DeleteDailyByIdUseCase(
    prismaDailyRepository,
    prismaUserRepository
  )

  return deleteDailyByIdUseCase
}
