import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { ProfessionalRepository } from '@/repositories/professional-repository'

interface GetProfessionalByIdUseCaseRequest {
  professionalId: string
}

interface GetProfessionalByIdUseCaseResponse {
  id: string
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string
  city: string
  uf: string
}

export class GetProfessionalByIdUseCase {
  constructor(private professionalRepository: ProfessionalRepository) {}

  async execute({
    professionalId,
  }: GetProfessionalByIdUseCaseRequest): Promise<{
    professional: GetProfessionalByIdUseCaseResponse
  }> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new ResourceNotFoundError()
    }

    return { professional }
  }
}
