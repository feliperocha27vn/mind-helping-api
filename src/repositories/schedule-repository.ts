import type { Prisma, Schedule } from '@prisma/client'

export interface ScheduleRepository {
  create(data: Prisma.ScheduleUncheckedCreateInput): Promise<Schedule>
  getById(id: string): Promise<Schedule | null>
  fetchMany(professionalPersonId: string): Promise<Schedule[] | null>
  delete(id: string): Promise<void>
}
