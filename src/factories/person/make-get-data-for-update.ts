import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetDataForUpdateUserUseCase } from '@/use-cases/person/user/get-data-for-update'

export function makeGetDataForUpdateUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const getDataForUpdateUserUseCase = new GetDataForUpdateUserUseCase(
    prismaUserRepository,
    prismaPersonRepository
  )

  return getDataForUpdateUserUseCase
}
