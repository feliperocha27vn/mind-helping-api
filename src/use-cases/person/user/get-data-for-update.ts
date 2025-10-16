import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { UserRepository } from '@/repositories/user-repository'

interface GetDataForUpdateUseCaseRequest {
  userId: string
}

interface GetDataForUpdateUseCaseReply {
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
      complement: string
      cep: string
      city: string
      uf: string
    }
  }
}

export class GetDataForUpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    userId,
  }: GetDataForUpdateUseCaseRequest): Promise<GetDataForUpdateUseCaseReply> {
    const person = await this.personRepository.findById(userId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(person.id)

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
          complement: person.complement,
          cep: person.cep,
          city: person.city,
          uf: person.uf,
        },
      },
    }
  }
}
