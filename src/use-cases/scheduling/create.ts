import { PersonNotFoundError } from '@/errors/person-not-found'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import type { HourlyRepository } from '@/repositories/hourly-repository'
import type { ProfessionalRepository } from '@/repositories/professional-repository'
import type { ScheduleRepository } from '@/repositories/schedule-repository'
import type { SchedulingRepository } from '@/repositories/scheduling-repository'
import type { UserRepository } from '@/repositories/user-repository'
import type { Scheduling } from '@prisma/client'

interface CreateSchedulingUseCaseRequest {
  professionalPersonId: string
  userPersonId: string
  scheduleId: string
  hour: string
  date: Date
}

interface CreateSchedulingUseCaseResponse {
  scheduling: Scheduling
}

export class CreateSchedulingUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private schedulingRepository: SchedulingRepository,
    private hourlyRepository: HourlyRepository,
    private professionalRepository: ProfessionalRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    date,
    hour,
    scheduleId,
    professionalPersonId,
    userPersonId,
  }: CreateSchedulingUseCaseRequest): Promise<CreateSchedulingUseCaseResponse> {
    const professional =
      await this.professionalRepository.getById(professionalPersonId)

    if (!professional) {
      throw new PersonNotFoundError()
    }

    const user = await this.userRepository.getById(userPersonId)

    if (!user) {
      throw new PersonNotFoundError()
    }

    const schedule = await this.scheduleRepository.getById(scheduleId)

    if (!schedule) {
      throw new ResourceNotFoundError()
    }

    const hourly = await this.hourlyRepository.getHourlyByDateAndHour(
      date,
      hour
    )

    if (!hourly) {
      throw new ResourceNotFoundError()
    }

    const scheduling = await this.schedulingRepository.create({
      hourlyId: hourly.id,
      professionalPersonId,
      userPersonId,
    })

    return { scheduling }
  }
}
