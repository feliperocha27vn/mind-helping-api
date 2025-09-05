import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { GetProfessionalByIdUseCase } from '@/use-cases/professional/get-professional'

export function makeGetByIdProfessionalUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const getByIdProfessionalUseCase = new GetProfessionalByIdUseCase(
    prismaProfessionalRepository
  )

  return getByIdProfessionalUseCase
}
