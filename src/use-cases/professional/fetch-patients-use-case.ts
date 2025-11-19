import { differenceInCalendarYears } from 'date-fns'
import { PersonNotFoundError } from '@/errors/person-not-found'
import type { PersonRepository } from '@/repositories/person-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface FetchPatientsUseCaseRequest {
  professionalId: string
  page: number
}

interface FetchPatientsUseCaseReply {
  patients: {
    patientId: string
    patientName: string
    patientAge: number
  }[]
}

export class FetchPatientsUseCase {
  constructor(
    private professionalsRepository: ProfessionalRepository,
    private schedulingsRepository: SchedulingRepository,
    private personRepository: PersonRepository
  ) {}

  async execute({
    professionalId,
    page,
  }: FetchPatientsUseCaseRequest): Promise<FetchPatientsUseCaseReply> {
    const professional =
      await this.professionalsRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const schedulings =
      await this.schedulingsRepository.fetchSchedulingsByProfessionalId(
        professionalId,
        page
      )

    const patientsWithData = await Promise.all(
      schedulings.map(async scheduling => {
        const userData = await this.personRepository.findById(
          scheduling.userPersonId
        )

        if (!userData) {
          throw new PersonNotFoundError()
        }

        const age = differenceInCalendarYears(new Date(), userData.birth_date)

        return {
          patientId: userData.id,
          patientName: userData.name,
          patientAge: age,
        }
      })
    )

    return { patients: patientsWithData }
  }
}
