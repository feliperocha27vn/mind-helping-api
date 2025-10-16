import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { Person, User } from '@prisma/client'

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string
  cpf?: string
  address?: string
  neighborhood?: string
  number?: number
  complement?: string
  cep?: string
  city?: string
  uf?: string
  phone?: string
  email?: string
  gender?: string
}

interface UpdateUserUseCaseReply {
  user: User
  person: Person
}

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    userId,
    ...data
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseReply> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    await this.personRepository.update(userId, data)
    await this.userRepository.update(userId, data)

    const updatedUser = await this.userRepository.getById(userId)

    if (!updatedUser) {
      throw new PersonNotFoundError()
    }

    const updatedPerson = await this.personRepository.findById(userId)

    if (!updatedPerson) {
      throw new PersonNotFoundError()
    }

    return { user: updatedUser, person: updatedPerson }
  }
}
