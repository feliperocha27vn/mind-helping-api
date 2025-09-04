import type { ProfessionalRepository } from '@/repositories/professional-repository'

interface FetchManyProfessionalsUseCaseRequest {
  search: string
}

interface FetchManyProfessionalsUseCaseResponse {
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string
  city: string
  uf: string
}

export class FetchManyProfessionalsUseCase {
  constructor(private professionalRepository: ProfessionalRepository) {}

  async execute({ search }: FetchManyProfessionalsUseCaseRequest): Promise<{
    professionals: FetchManyProfessionalsUseCaseResponse[]
  }> {
    const professionals = await this.professionalRepository.fetchMany(search)

    return { professionals }
  }
}
