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
  voluntary: boolean
}

export interface ProfessionalRepository {
  create(data: Prisma.ProfessionalUncheckedCreateInput): Promise<Professional>
  fetchMany(search: string): Promise<ProfessionalWithPerson[] | []>
  getById(professionalId: string): Promise<ProfessionalWithPerson | null>
  getProfessionalById(professionalId: string): Promise<Professional | null>
  update(
    professionalId: string,
    data: Prisma.ProfessionalUncheckedUpdateInput
  ): Promise<Professional | null>
}
