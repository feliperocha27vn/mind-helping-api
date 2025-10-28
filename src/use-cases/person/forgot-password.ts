import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ResetPasswordCodeRepository } from '@/repositories/reset-password-codes-repository'
import { hash } from 'bcryptjs'
import { randomInt } from 'node:crypto'

interface ForgotPasswordUseCaseRequest {
  email: string
}

interface ForgotPasswordUseCaseReply {
  resetCode: string
}

export class ForgotPasswordUseCase {
  constructor(
    private personRepository: PersonRepository,
    private resetPasswordCodeRepository: ResetPasswordCodeRepository
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseReply> {
    const person = await this.personRepository.findByEmail(email)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const min = 10 ** (4 - 1)
    const max = 10 ** 4 - 1

    const resetCode = randomInt(min, max + 1).toString()

    await this.resetPasswordCodeRepository.create({
      personId: person.id,
      code: await hash(resetCode, 6),
    })

    return { resetCode }
  }
}
