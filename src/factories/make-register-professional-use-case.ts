import { PrismaPersonRepository } from '../repositories/prisma/prisma-person-repository'
import { PrismaProfessionalRepository } from '../repositories/prisma/prisma-professional-repository'
import { RegisterProfessionalUseCase } from '../use-cases/person/register-professional'

export function makeRegisterProfessionalUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaProfessionalRepository = new PrismaProfessionalRepository()
  const registerProfessionalUseCase = new RegisterProfessionalUseCase(
    prismaProfessionalRepository,
    prismaPersonRepository
  )

  return registerProfessionalUseCase
}
