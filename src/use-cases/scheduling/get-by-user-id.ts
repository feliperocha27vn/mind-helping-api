import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { PersonRepository } from '@/repositories/person-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetSchedulingUseCaseRequest {
  userId: string
}

interface GetSchedulingUseCaseResponse {
  schedulingDetails: {
    id: string
    nameProfessional: string
    phoneProfessional: string
    emailProfessional: string
    date: Date
    hour: string
    hourlyId: string
    address: {
      street: string
      neighborhood: string
      complement: string
      cep: string
      city: string
      uf: string
    }
  }
}

export class GetSchedulingUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private personRepository: PersonRepository,
    private hourlyRepository: HourlyRepository
  ) {}

  async execute({
    userId,
  }: GetSchedulingUseCaseRequest): Promise<GetSchedulingUseCaseResponse> {
    const scheduling = await this.schedulingRepository.getByUserId(userId)

    if (!scheduling) {
      throw new ResourceNotFoundError()
    }

    const professional = await this.personRepository.findById(
      scheduling.professionalPersonId
    )

    if (!professional) {
      throw new ResourceNotFoundError()
    }

    const hourly = await this.hourlyRepository.getById(scheduling.hourlyId)

    if (!hourly) {
      throw new ResourceNotFoundError()
    }

    const schedulingDetails = {
      id: scheduling.id,
      nameProfessional: professional.name,
      phoneProfessional: professional.phone,
      emailProfessional: professional.email,
      date: hourly.date,
      hour: hourly.hour,
      hourlyId: hourly.id,
      address: {
        street: professional.address,
        neighborhood: professional.neighborhood,
        complement: professional.complement,
        cep: professional.cep,
        city: professional.city,
        uf: professional.uf,
      },
    }

    return { schedulingDetails }
  }
}
