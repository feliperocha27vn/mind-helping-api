import type { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type {
  ProfessionalRepository,
  ProfessionalWithPerson,
} from '../professional-repository'

export class PrismaProfessionalRepository implements ProfessionalRepository {
  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = await prisma.professional.create({
      data,
    })

    return professional
  }

  async fetchMany(search: string) {
    const professionals = await prisma.$queryRaw`
      SELECT person.name, person.email, person.phone, person.address, person.neighborhood, person.city, person.uf, person.id
      FROM professionals
      LEFT JOIN person ON professionals.person_id = person.id
      WHERE person.name ILIKE '%' || ${search} || '%'
    `

    return professionals as ProfessionalWithPerson[]
  }
}
