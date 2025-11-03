import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { DeletePersonByIdUseCase } from '@/use-cases/person/delete-person-by-id-use-case'

export function makeDeletePersonByIdUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const deletePersonById = new DeletePersonByIdUseCase(prismaPersonRepository)

  return deletePersonById
}
