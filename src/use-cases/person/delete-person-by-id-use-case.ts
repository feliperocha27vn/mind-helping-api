import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { Person } from '@prisma/client'

interface DeletePersonByIdUseCaseRequest {
  personId: string
}

interface DeletePersonByIdUseCaseReply {
  person: Person
}

export class DeletePersonByIdUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute({
    personId,
  }: DeletePersonByIdUseCaseRequest): Promise<DeletePersonByIdUseCaseReply> {
    const personDeleted = await this.personRepository.delete(personId)

    if (!personDeleted) {
      throw new PersonNotFoundError()
    }

    return {
      person: personDeleted,
    }
  }
}
