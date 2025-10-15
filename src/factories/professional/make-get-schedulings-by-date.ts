import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetSchedulingsByDateUseCase } from '@/use-cases/professional/get-schedulings-by-date'

export function makeGetSchedulingsByDate() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const getSchedulingsByDateUseCase = new GetSchedulingsByDateUseCase(
    prismaSchedulingRepository,
    prismaProfessionalRepository
  )

  return getSchedulingsByDateUseCase
}
