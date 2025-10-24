import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { GetDataForUpdateProfessionalUseCase } from '@/use-cases/person/professional/get-data-for-update-professional'

export function makeGetDataForUpdateProfessionalUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const getDataForUpdateProfessionalUseCase =
    new GetDataForUpdateProfessionalUseCase(
      prismaProfessionalRepository,
      prismaPersonRepository
    )

  return getDataForUpdateProfessionalUseCase
}
