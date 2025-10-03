import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import type { PersonRepository } from '@/repositories/person-repository'
import { compare } from 'bcryptjs'

interface AuthenticatePersonUseCaseRequest {
  email: string
  password: string
}

interface AuthenticatePersonUseCaseReply {
  isAuthenticated: boolean
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

    const doesPasswordMatch = await compare(password, person.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return { isAuthenticated: true }
  }
}
