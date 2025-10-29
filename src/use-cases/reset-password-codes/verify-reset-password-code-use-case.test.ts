import { NotFoundResetCodePasswordError } from '@/errors/not-found-reset-code-password-error'
import { ResetPasswordCodeExpiresError } from '@/errors/reset-password-code-expires-error'
import { InMemoryPersonRepository } from '@/in-memory-repository/in-memory-person-repository'
import { InMemoryResetPasswordCodesRepository } from '@/in-memory-repository/in-memory-reset-password-codes-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import { hash } from 'bcryptjs'
import { addMinutes } from 'date-fns'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VerifyResetPasswordCodeUseCase } from './verify-reset-password-code-use-case '

let personRepository: PersonRepository
let resetPasswordCodesRepository: ResetPasswordCodeRepository
let sut: VerifyResetPasswordCodeUseCase

describe('Verify reset password code use case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    personRepository = new InMemoryPersonRepository()
    resetPasswordCodesRepository = new InMemoryResetPasswordCodesRepository()
    sut = new VerifyResetPasswordCodeUseCase(
      resetPasswordCodesRepository,
      personRepository
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check for a valid password reset code', async () => {
    vi.setSystemTime(new Date('2024-01-01 10:00:00'))

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

    await resetPasswordCodesRepository.create({
      code: await hash('1234', 6),
      personId: personCreated.id,
      expiresAt: addMinutes(new Date(), 15),
    })

    const { resetPasswordCode } = await sut.execute({
      email: personCreated.email,
      code: '1234',
    })

    expect(resetPasswordCode.personId).toEqual(personCreated.id)
  })

  it('should not be able to check for an invalid password reset code', async () => {
    vi.setSystemTime(new Date('2024-01-01 10:00:00'))

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

    await resetPasswordCodesRepository.create({
      code: await hash('1234', 6),
      personId: personCreated.id,
      expiresAt: addMinutes(new Date(), 15),
    })

    await expect(
      sut.execute({
        email: personCreated.email,
        code: '4321',
      })
    ).rejects.toBeInstanceOf(NotFoundResetCodePasswordError)
  })

  it('should not be able to verify a password reset code that is expired', async () => {
    vi.setSystemTime(new Date('2024-01-01 10:00:00'))

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

    await resetPasswordCodesRepository.create({
      code: await hash('1234', 6),
      personId: personCreated.id,
      expiresAt: addMinutes(new Date(), 15),
    })

    vi.setSystemTime(new Date('2024-01-01 10:16:00'))

    await expect(
      sut.execute({
        email: personCreated.email,
        code: '1234',
      })
    ).rejects.toBeInstanceOf(ResetPasswordCodeExpiresError)
  })
})
