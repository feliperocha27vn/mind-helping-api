import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidParametersError } from '../../errors/invalid-parameters'
import { InMemoryPersonRepository } from '../../in-memory-repository/in-memory-person-repository'
import { RegisterUseCase } from './register'

let personRepository: InMemoryPersonRepository
let sut: RegisterUseCase

describe('Register person use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    sut = new RegisterUseCase(personRepository)
  })

  it('should be able to register new person', async () => {
    const { person } = await sut.execute({
      name: 'Dr. Maria Silva Santos',
      birth_date: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 201',
      cepUser: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
      password: 'senha123',
    })

    expect(person.id).toEqual(expect.any(String))
  })

  it('shoulde be able make hash password', async () => {
    const { person } = await sut.execute({
      name: 'Dr. Maria Silva Santos',
      birth_date: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 201',
      cepUser: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
      password: 'senha123',
    })

    const isPasswordHash = await compare('senha123', person.password_hash)

    expect(isPasswordHash).toBe(true)
  })

  it('should be able not register a CEP invalid', async () => {
    await expect(() =>
      sut.execute({
        name: 'Dr. Maria Silva Santos',
        birth_date: '1985-03-15',
        cpf: '123.456.789-00',
        address: 'Rua das Flores',
        neighborhood: 'Centro',
        number: 1232,
        complement: 'Sala 201',
        cepUser: 'not-valid-cep',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 99999-8888',
        email: 'maria.santos@email.com',
        password: 'senha123',
      })
    ).rejects.toBeInstanceOf(InvalidParametersError)
  })

  it('should not be able to register a person with email already exists', async () => {
    sut.execute({
      name: 'Dr. Maria Silva Santos',
      birth_date: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores',
      neighborhood: 'Centro',
      number: 1232,
      complement: 'Sala 201',
      cepUser: '01234-567',
      city: 'São Paulo',
      uf: 'SP',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
      password: 'senha123',
    })

    await expect(() =>
      sut.execute({
        name: 'Dr. Maria Silva Santos',
        birth_date: '1985-03-15',
        cpf: '123.456.789-00',
        address: 'Rua das Flores',
        neighborhood: 'Centro',
        number: 1232,
        complement: 'Sala 201',
        cepUser: '01234-567',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 99999-8888',
        email: 'maria.santos@email.com',
        password: 'senha123',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
