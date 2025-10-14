import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { GetSchedulingsCancelByProfessionalId } from '@/use-cases/professional/get-schedulings-cancel-by-professional-id'

export function makeGetSchedulingsCancelByProfessionalId() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const GetSchedulingsCancelByProfessionalIdUseCase =
    new GetSchedulingsCancelByProfessionalId(
      prismaSchedulingRepository,
      prismaProfessionalRepository
    )

  return GetSchedulingsCancelByProfessionalIdUseCase
}
