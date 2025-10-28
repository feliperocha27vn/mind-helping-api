import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import { compare, hash } from 'bcryptjs'

interface UpdatePassowrdPersonUseCaseRequest {
  personId: string
  passowordCurrent: string
  newPassword: string
}

export class UpdatePassowrdPersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute({
    personId,
    newPassword,
    passowordCurrent,
  }: UpdatePassowrdPersonUseCaseRequest) {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const doesPasswordMatch = await compare(
      passowordCurrent,
      person.password_hash
    )

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    await this.personRepository.update(personId, {
      password_hash: await hash(newPassword, 10),
    })
  }
}
