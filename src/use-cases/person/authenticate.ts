import { AccountDeletedError } from '@/errors/account-deleted'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import type { PersonRepository } from '@/repositories/person-repository'
import { compare } from 'bcryptjs'

interface AuthenticatePersonUseCaseRequest {
  email: string
  password: string
}

interface AuthenticatePersonUseCaseReply {
  user: {
    isAuthenticated: boolean
    userId: string
  }
}

export class AuthenticatePersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute({
    email,
    password,
  }: AuthenticatePersonUseCaseRequest): Promise<AuthenticatePersonUseCaseReply> {
    const person = await this.personRepository.findByEmail(email)

    if (!person) {
      throw new InvalidCredentialsError()
    }

    if (person.isDeleted) {
      throw new AccountDeletedError()
    }

    const doesPasswordMatch = await compare(password, person.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      user: {
        isAuthenticated: true,
        userId: person.id,
      },
    }
  }
}
