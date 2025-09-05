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

  async getById(
    professionalId: string
  ): Promise<ProfessionalWithPerson | null> {
    const professional = await prisma.professional.findUnique({
      where: {
        person_id: professionalId,
      },
      include: {
        person: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            neighborhood: true,
            city: true,
            uf: true,
          },
        },
      },
    })

    if (!professional || !professional.person) {
      return null
    }

    // Mapear para o formato esperado
    return {
      id: professional.person.id,
      name: professional.person.name,
      email: professional.person.email,
      phone: professional.person.phone,
      address: professional.person.address,
      neighborhood: professional.person.neighborhood,
      city: professional.person.city,
      uf: professional.person.uf,
    }
  }
}
