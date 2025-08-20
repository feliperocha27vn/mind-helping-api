import type { Professional } from '@prisma/client'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import type { PersonRepository } from '../../repositories/person-repository'
import type { ProfessionalRepository } from '../../repositories/professional-repository'

interface RegisterProfessionalUseCaseRequest {
  person_id: string
  crp: string
  voluntary: boolean
}

interface RegisterProfessionalUseCaseResponse {
  professional: Professional
}

export class RegisterProfessionalUseCase {
  constructor(
    private registerProfessionalRepository: ProfessionalRepository,
    private registerPersonRepository: PersonRepository
  ) {}

  async execute({
    person_id,
    crp,
    voluntary,
  }: RegisterProfessionalUseCaseRequest): Promise<RegisterProfessionalUseCaseResponse> {
    const person = await this.registerPersonRepository.findById(person_id)

    if (!person) {
      throw new ResourceNotFoundError()
    }

    const professional = await this.registerProfessionalRepository.create({
      person_id: person.id,
      crp,
      voluntary,
    })

    return {
      professional,
    }
  }
}
