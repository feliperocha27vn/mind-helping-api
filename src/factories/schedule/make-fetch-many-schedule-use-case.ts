import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaScheduleRepository } from '@/repositories/prisma/prisma-schedule-repository'
import { FetchManySchedulesUseCase } from '@/use-cases/schedule/fetch-many'

export function makeFetchManyScheduleUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const prismaScheduleRepository = new PrismaScheduleRepository()
  const fetchManySchedulesUseCase = new FetchManySchedulesUseCase(
    prismaScheduleRepository,
    prismaProfessionalRepository
  )

  return fetchManySchedulesUseCase
}
