import type { Prisma, Professional } from '@prisma/client'

export interface ProfessionalWithPerson {
  id: string
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string
  city: string
  uf: string
}

export interface ProfessionalRepository {
  create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>
  fetchMany(search: string): Promise<ProfessionalWithPerson[] | []>
}
