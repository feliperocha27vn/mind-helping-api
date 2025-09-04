import { PrismaProfessionalRepository } from '@/repositories/prisma/prisma-professional-repository'
import { FetchManyProfessionalsUseCase } from '@/use-cases/professional/fetch-many'

export function makeFetchManyProfessionalsUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const fetchManyProfessionalsUseCase = new FetchManyProfessionalsUseCase(
    prismaProfessionalRepository
  )

  return fetchManyProfessionalsUseCase
}
