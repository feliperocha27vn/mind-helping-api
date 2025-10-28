import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { UpdatePasswordPersonUseCase } from '@/use-cases/person/update-password'

export function makeUpdatePasswordPersonUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const updatePasswordPersonUseCase = new UpdatePasswordPersonUseCase(
    prismaPersonRepository
  )

  return updatePasswordPersonUseCase
}
