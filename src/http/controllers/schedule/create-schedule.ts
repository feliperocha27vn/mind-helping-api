import { DateNotValidError } from '@/errors/date-not-valid'
import { makeCreateScheduleUseCase } from '@/factories/schedule/make-create-schedule-use-case'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createSchedule: FastifyPluginAsyncZod = async app => {
  app.post(
    '/schedules/:professionalPersonId',
    {
      schema: {
        tags: ['Schedules'],
        summary: 'Criar horários para profissional',
        description:
          'Cria horários (schedules) para um profissional. Recebe `professionalPersonId` nos parâmetros e um array de objetos de schedule no body (cada item com horários, intervalo, política de cancelamento, valor médio e observações). Retorna 201 em caso de sucesso.',
        params: z.object({
          professionalPersonId: z.uuid(),
        }),
        body: z
          .object({
            initialTime: z.coerce.date(),
            endTime: z.coerce.date(),
            interval: z.number(),
            cancellationPolicy: z.number(),
            averageValue: z.number(),
            observation: z.string().max(500),
            isControlled: z.boolean(),
          })
          .array(),
        response: {
          201: z.void(),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { professionalPersonId } = request.params
      const schedules = request.body

      const createScheduleUseCase = makeCreateScheduleUseCase()

      try {
        await createScheduleUseCase.execute({
          professionalPersonId,
          schedules,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof DateNotValidError) {
          return reply.status(400).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
