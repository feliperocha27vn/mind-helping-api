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

  async update(personId: string, data: Prisma.PersonUncheckedUpdateInput) {
    const existingPerson = this.items.find(item => item.id === personId)

    if (!existingPerson) {
      return null
    }

    const updatedPerson = {
      ...existingPerson,
      name: (data.name as string) ?? existingPerson.name,
      cpf: (data.cpf as string) ?? existingPerson.cpf,
      address: (data.address as string) ?? existingPerson.address,
      neighborhood:
        (data.neighborhood as string) ?? existingPerson.neighborhood,
      number: (data.number as number) ?? existingPerson.number,
      complement: (data.complement as string) ?? existingPerson.complement,
      cep: (data.cep as string) ?? existingPerson.cep,
      city: (data.city as string) ?? existingPerson.city,
      uf: (data.uf as string) ?? existingPerson.uf,
      phone: (data.phone as string) ?? existingPerson.phone,
      email: (data.email as string) ?? existingPerson.email,
    }

    const personIndex = this.items.findIndex(item => item.id === personId)

    this.items[personIndex] = updatedPerson

    return updatedPerson
  }
}
