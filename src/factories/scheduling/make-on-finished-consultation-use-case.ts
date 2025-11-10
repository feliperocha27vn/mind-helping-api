import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { OnFinishedConsultationUseCase } from '@/use-cases/scheduling/on-finished-consultation-use-case'

export function makeOnFinishedConsultationUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const onFinishedConsultationUseCase = new OnFinishedConsultationUseCase(
    prismaSchedulingRepository
  )

  return onFinishedConsultationUseCase
}
