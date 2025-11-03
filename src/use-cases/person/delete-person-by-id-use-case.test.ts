import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPersonRepository } from '../../in-memory-repository/in-memory-person-repository'
import { DeletePersonByIdUseCase } from './delete-person-by-id-use-case'

let personRepository: InMemoryPersonRepository
let sut: DeletePersonByIdUseCase

describe('Delete person use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    sut = new DeletePersonByIdUseCase(personRepository)
  })

  it('should be able to delete a person by id', async () => {
    const person = await personRepository.create({
      name: 'Dr. Maria Silva Santos',
      birth_date: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 201',
      cep: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
      password_hash: await hash('senha123', 6),
    })

    const personDeleted = await sut.execute({ personId: person.id })

    expect(personDeleted.person.isDeleted).toEqual(true)
  })
})
