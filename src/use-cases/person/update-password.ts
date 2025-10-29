import { InvalidCredentialsError } from '@/errors/invalid-credentials'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Person } from '@prisma/client'
import { hash } from 'bcryptjs'

interface UpdatePasswordPersonUseCaseRequest {
  personId: string
  newPassword: string
  repeatPassword: string
}

interface UpdatePasswordPersonUseCaseReply {
  person: Person
}

export class UpdatePasswordPersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute({
    personId,
    newPassword,
    repeatPassword,
  }: UpdatePasswordPersonUseCaseRequest): Promise<UpdatePasswordPersonUseCaseReply> {
    const person = await this.personRepository.findById(personId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    if (newPassword !== repeatPassword) {
      throw new InvalidCredentialsError()
    }

    const personUpdated = await this.personRepository.update(personId, {
      password_hash: await hash(newPassword, 10),
    })

    if (!personUpdated) {
      throw new PersonNotFoundError()
    }

    return { person: personUpdated }
  }
}
