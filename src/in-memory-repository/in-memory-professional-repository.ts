import type { Person, Prisma, Professional } from '@prisma/client'
import type { PersonRepository } from '../repositories/person-repository'
import type { ProfessionalRepository } from '../repositories/professional-repository'
import type { InMemoryPersonRepository } from './in-memory-person-repository'

export class InMemoryProfessionalRepository implements ProfessionalRepository {
  public items: Professional[] = []

  constructor(private personRepository?: PersonRepository) {}

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = {
      person_id: data.person_id,
      crp: data.crp,
      voluntary: data.voluntary,
    }

    this.items.push(professional)

    return professional
  }

  async fetchMany(search: string) {
    if (!this.personRepository) {
      throw new Error('PersonRepository not provided')
    }

    // Acessa o array items do InMemoryPersonRepository
    const allPersons =
      (this.personRepository as InMemoryPersonRepository).items || []

    const persons = allPersons.filter((person: Person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    )

    const professionalWithPerson = this.items.filter(professional =>
      persons.some((person: Person) => person.id === professional.person_id)
    )

    const professionals = professionalWithPerson
      .map(professional => {
        const person = persons.find(
          (person: Person) => person.id === professional.person_id
        )

        if (!person) {
          return null
        }

        return {
          id: person.id,
          name: person.name,
          email: person.email,
          phone: person.phone,
          address: person.address,
          neighborhood: person.neighborhood,
          city: person.city,
          uf: person.uf,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    return professionals
  }
}
