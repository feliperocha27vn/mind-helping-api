import type { Person, Prisma, Professional } from '@prisma/client'
import type { ProfessionalRepository } from '../repositories/professional-repository'

export class InMemoryProfessionalRepository implements ProfessionalRepository {
  public items: Person[] = []
  public professionals: Professional[] = []

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = {
      person_id: data.person_id,
      crp: data.crp,
      voluntary: data.voluntary,
    }

    this.professionals.push(professional)

    return professional
  }

  async fetchMany(search: string) {
    const professionals = this.items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )

    return professionals
  }
}
