import { PrismaHourlyRepository } from '@/repositories/prisma/prisma-hourly-repository'
import { PrismaPersonRepository } from '@/repositories/prisma/prisma-person-repository'
import { PrismaSchedulingRepository } from '@/repositories/prisma/prisma-scheduling-repository'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { FetchSchedulingsByProfessionalIdUseCase } from '@/use-cases/scheduling/fetch-schedulings-by-professional-id-use-case'

export function makeFetchSchedulingsByProfessionalIdUseCase() {
  const prismaSchedulingRepository = new PrismaSchedulingRepository()
  const prismaPersonRepository = new PrismaPersonRepository()
  const prismaUsersRepository = new PrismaUserRepository()
  const prismaHourlyRepository = new PrismaHourlyRepository()
  const fetchSchedulingsByProfessionalIdUseCase =
    new FetchSchedulingsByProfessionalIdUseCase(
      prismaSchedulingRepository,
      prismaPersonRepository,
      prismaUsersRepository,
      prismaHourlyRepository
    )

  return fetchSchedulingsByProfessionalIdUseCase
}
