import { NotFoundResetCodePasswordError } from '@/errors/not-found-reset-code-password-error'
import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResetPasswordCodeExpiresError } from '@/errors/reset-password-code-expires-error'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import type { ResetPasswordCodes } from '@prisma/client'
import { compare } from 'bcryptjs'

interface VerifyResetPasswordCodeUseCaseRequest {
  email: string
  code: string
}

interface VerifyResetPasswordCodeUseCaseReply {
  resetPasswordCode: ResetPasswordCodes
}

export class VerifyResetPasswordCodeUseCase {
  constructor(
    private resetPasswordCodesRepository: ResetPasswordCodeRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    email,
    code,
  }: VerifyResetPasswordCodeUseCaseRequest): Promise<VerifyResetPasswordCodeUseCaseReply> {
    const person = await this.personRepository.findByEmail(email)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const resetPasswordCode =
      await this.resetPasswordCodesRepository.getFirstByPersonId(person.id)

    if (!resetPasswordCode) {
      throw new NotFoundResetCodePasswordError()
    }

    const doesCodeMatch = await compare(code, resetPasswordCode.code)

    if (!doesCodeMatch) {
      throw new NotFoundResetCodePasswordError()
    }

    if (resetPasswordCode.expiresAt < new Date()) {
      throw new ResetPasswordCodeExpiresError()
    }

    return { resetPasswordCode }
  }
}
