import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetNumberPatientsServedUseCase } from '@/use-cases/scheduling/get-number-patients-served-by-month-use-case'

export function makeGetNumberPatientsServedByMonthUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaProfessionRepository = new PrismaProfessionalRepository()
  const getNumberPatientsServedByMonthUseCase =
    new GetNumberPatientsServedUseCase(
      prismaSchedulingRepository,
      prismaProfessionRepository
    )
  return getNumberPatientsServedByMonthUseCase
}
