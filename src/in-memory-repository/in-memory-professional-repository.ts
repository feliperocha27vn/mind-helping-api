import type { Prisma, Professional } from '@prisma/client'
import type { ProfessionalRepository } from '../repositories/professional-repository'

export class InMemoryProfessionalRepository implements ProfessionalRepository {
  public items: Professional[] = []

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = {
      person_id: data.person_id,
      crp: data.crp,
      voluntary: data.voluntary,
    }

    this.items.push(professional)

    return professional
  }
}
