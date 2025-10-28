import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryResetPasswordCodesRepository } from '@/in-memory-repository/in-memory-reset-password-codes-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ForgotPasswordUseCase } from './forgot-password'

let personRepository: PersonRepository
let resetPasswordCodesRepository: ResetPasswordCodeRepository
let sut: ForgotPasswordUseCase

describe('Forgot password use case', () => {
  beforeEach(() => {
    personRepository = new InMemoryPersonRepository()
    resetPasswordCodesRepository = new InMemoryResetPasswordCodesRepository()
    sut = new ForgotPasswordUseCase(
      personRepository,
      resetPasswordCodesRepository
    )
  })

  it('should be able gen reset code', async () => {
    const personCreated = await personRepository.create({
      id: 'person-01',
      name: 'Maria Silva Santos',
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

    const { resetCode } = await sut.execute({
      email: personCreated.email,
    })

    expect(resetCode).toHaveLength(4)
  })
})
