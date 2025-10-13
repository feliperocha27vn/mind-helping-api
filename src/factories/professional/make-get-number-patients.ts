import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetNumberPatientsUseCase } from '@/use-cases/professional/get-number-patients'

export function makeGetNumberPatientsUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const getNumberPatientsUseCase = new GetNumberPatientsUseCase(
    prismaSchedulingRepository,
    prismaProfessionalRepository
  )

  return getNumberPatientsUseCase
}
