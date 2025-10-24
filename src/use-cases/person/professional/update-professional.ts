import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'

interface UpdateProfessionalUseCaseRequest {
  professionalId: string
  name?: string
  birthDate?: Date
  phone?: string
  email?: string
  cpf?: string
  voluntary?: boolean
  street?: string
  neighborhood?: string
  number?: number
  complement?: string
  cep?: string
  city?: string
  uf?: string
}

interface UpdateProfessionalUseCaseReply {
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

export class UpdateProfessionalUseCase {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    professionalId,
    ...data
  }: UpdateProfessionalUseCaseRequest): Promise<UpdateProfessionalUseCaseReply> {
    const person = await this.personRepository.findById(professionalId)

    if (!person) {
      throw new PersonNotFoundError()
    }

    await this.personRepository.update(professionalId, {
      address: data.street,
      neighborhood: data.neighborhood,
      number: data.number,
      complement: data.complement,
      cep: data.cep,
      city: data.city,
      uf: data.uf,
      phone: data.phone,
      name: data.name,
      cpf: data.cpf,
      email: data.email,
    })
    await this.professionalRepository.update(professionalId, {
      voluntary: data.voluntary,
    })

    const personUpdated = await this.personRepository.findById(professionalId)

    if (!personUpdated) {
      throw new PersonNotFoundError()
    }

    const professionalUpdated =
      await this.professionalRepository.getProfessionalById(professionalId)

    if (!professionalUpdated) {
      throw new PersonNotFoundError()
    }

    return {
      professional: {
        name: personUpdated.name,
        birthDate: personUpdated.birth_date,
        phone: personUpdated.phone,
        email: personUpdated.email,
        cpf: personUpdated.cpf,
        crp: professionalUpdated.crp,
        voluntary: professionalUpdated.voluntary,
        address: {
          street: personUpdated.address,
          neighborhood: personUpdated.neighborhood,
          number: personUpdated.number,
          complement: personUpdated.complement,
          cep: personUpdated.cep,
          city: personUpdated.city,
          uf: personUpdated.uf,
        },
      },
    }
  }
}
