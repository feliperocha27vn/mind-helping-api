import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { UpdateProfessionalUseCase } from '@/use-cases/person/professional/update-professional'

export function makeUpdateProfessionalUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const updateProfessionalUseCase = new UpdateProfessionalUseCase(
    prismaProfessionalRepository,
    prismaPersonRepository
  )

  return updateProfessionalUseCase
}
