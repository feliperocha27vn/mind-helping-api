import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'

interface GetDataForUpdateProfessionalRequest {
  professionalId: string
}

interface GetDataForUpdateProfessionalReply {
  professional: {
    name: string
    birthDate: Date
    phone: string
    email: string
    cpf: string
    crp: string
    voluntary: boolean
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

export class GetDataForUpdateProfessionalUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    professionalId,
  }: GetDataForUpdateProfessionalRequest): Promise<GetDataForUpdateProfessionalReply> {
    const person = await this.personRepository.findById(professionalId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    const professional = await this.professionalRepository.getProfessionalById(
      person.id
    )

    if (!professional) {
      throw new PersonNotFoundError()
    }

    return {
      professional: {
        name: person.name,
        birthDate: person.birth_date,
        phone: person.phone,
        email: person.email,
        cpf: person.cpf,
        crp: professional.crp,
        voluntary: professional.voluntary,
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
