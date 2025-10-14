import { PersonNotFoundError } from '@/errors/person-not-found'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'

interface GetAttendanceRateUseCaseRequest {
  professionalId: string
  startDay: Date
  endDay: Date
}

interface GetAttendanceRateUseCaseReply {
  attendanceRate: number
}

export class GetAttendanceRateUseCase {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private professionalRepository: ProfessionalRepository
  ) {}

  async execute({
    professionalId,
    startDay,
    endDay,
  }: GetAttendanceRateUseCaseRequest): Promise<GetAttendanceRateUseCaseReply> {
    const professional =
      await this.professionalRepository.getById(professionalId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const countSchedulings =
      await this.schedulingRepository.getSchedulingsByDate(
        professionalId,
        startDay,
        endDay
      )

    const countCanceledSchedulings =
      await this.schedulingRepository.getShedulingsCancelByProfessionalId(
        professionalId
      )

    if (
      !countSchedulings ||
      (countSchedulings === 0 && countCanceledSchedulings === 0) ||
      !countCanceledSchedulings
    ) {
      return {
        attendanceRate: 0,
      }
    }

    const attendanceRate =
      ((countSchedulings - countCanceledSchedulings) / countSchedulings) * 100

    return {
      attendanceRate,
    }
  }
}
