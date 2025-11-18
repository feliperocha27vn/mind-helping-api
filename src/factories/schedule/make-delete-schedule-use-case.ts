import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { DeleteScheduleUseCase } from '@/use-cases/schedule/delete'

export function makeDeleteScheduleUseCase() {
  const prismaScheduleRepository = new PrismaScheduleRepository()
  const deleteScheduleUseCase = new DeleteScheduleUseCase(
    prismaScheduleRepository
  )

  return deleteScheduleUseCase
}
