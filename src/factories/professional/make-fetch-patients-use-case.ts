import { PrismaPersonRepository } from "@/repositories/prisma/prisma-person-repository"
import { PrismaProfessionalRepository } from "@/repositories/prisma/prisma-professional-repository"
import { PrismaSchedulingRepository } from "@/repositories/prisma/prisma-scheduling-repository"
import { FetchPatientsUseCase } from "@/use-cases/professional/fetch-patients-use-case"

export function makeFetchPatientsUseCase() {
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const fetchPatientsUseCase = new FetchPatientsUseCase(
    prismaProfessionalRepository,
    prismaSchedulingRepository,
    prismaPersonRepository
  )

  return fetchPatientsUseCase
}
