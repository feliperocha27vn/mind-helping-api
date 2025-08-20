import type { UserRepository } from '@/repositories/user-repository'
import type { User } from '@prisma/client'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import type { PersonRepository } from '../../repositories/person-repository'

interface RegisterUserUseCaseRequest {
  person_id: string
  gender?: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    person_id,
    gender,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const person = await this.personRepository.findById(person_id)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const user = await this.userRepository.create({
      person_id: person.id,
      gender,
    })

    return {
      user,
    }
  }
}
