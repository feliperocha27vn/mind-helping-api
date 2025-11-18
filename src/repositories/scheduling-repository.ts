import type { Prisma, Scheduling } from '@prisma/client'

export interface SchedulingRepository {
  create(data: Prisma.SchedulingUncheckedCreateInput): Promise<Scheduling>
  getByUserId(userId: string): Promise<Scheduling | null>
  getPatientsByProfessionalId(professionalId: string): Promise<number | null>
  getSchedulingsByDate(
    professionalId: string,
    startDay: Date,
    endDay: Date
  ): Promise<number | null>
  getShedulingsCancelByProfessionalId(
    professionalId: string,
    startDay: Date,
    endDay: Date
  ): Promise<number | null>
  setCancelScheduling(schedulingId: string): Promise<Scheduling | null>
  getById(schedulingId: string): Promise<Scheduling | null>
  onFinishedConsultation(schedulingId: string): Promise<void>
  getByHourlyId(hourlyId: string): Promise<Scheduling[]>
  getSchedulingsByMonth(professionalId: string, month: number): Promise<number>
  getSchedulingsByPatientId(patientId: string): Promise<Scheduling[]>
}
