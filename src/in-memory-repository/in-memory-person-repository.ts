import type { Person, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import type { PersonRepository } from '../repositories/person-repository'

export class InMemoryPersonRepository implements PersonRepository {
  public items: Person[] = []

  async create(data: Prisma.PersonUncheckedCreateInput) {
    const person = {
      id: data.id ?? randomUUID(),
      name: data.name,
      birth_date: new Date(data.birth_date),
      cpf: data.cpf,
      address: data.address,
      neighborhood: data.neighborhood,
      number: data.number,
      complement: data.complement,
      cep: data.cep,
      city: data.city,
      uf: data.uf,
      phone: data.phone,
      email: data.email,
      password_hash: data.password_hash,
    }

    this.items.push(person)

    return person
  }

  async findById(personId: string) {
    const person = this.items.find(item => item.id === personId)

    if (!person) {
      return null
    }

    return person
  }

  async findByEmail(email: string) {
      const person = this.items.find(item => item.email === email)

      if (!person) {
          return null
      }

      return person
  }
}
