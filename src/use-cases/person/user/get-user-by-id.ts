import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'

interface GetUserByIdUseCaseRequest {
  userId: string
}

interface GetUserByIdUseCaseReply {
  user: {
    name: string
    birthDate: Date
    phone: string
    email: string
    cpf: string
    gender: string
    address: {
      street: string
      neighborhood: string
      number: number
      cep: string
      city: string
    }
  }
}

export class GetUserByIdUseCase {
  constructor(
    private personRepository: PersonRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    userId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseReply> {
    const person = await this.personRepository.findById(userId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    return {
      user: {
        name: person.name,
        birthDate: person.birth_date,
        phone: person.phone,
        email: person.email,
        cpf: person.cpf,
        gender: user.gender,
        address: {
          street: person.address,
          neighborhood: person.neighborhood,
          number: person.number,
          cep: person.cep,
          city: person.city,
        },
      },
    }
  }
}
