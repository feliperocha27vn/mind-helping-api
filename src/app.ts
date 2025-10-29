import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { cvvCallsRoutes } from './http/controllers/cvv-calls/routes'
import { dailysRoutes } from './http/controllers/dailys/routes'
import { feelingsUserRoutes } from './http/controllers/feelings-user/routes'
import { routesGoal } from './http/controllers/goal/routes'
import { hourliesRoutes } from './http/controllers/hourlies/routes'
import { personRoutes } from './http/controllers/person/routes'
import { routesProfessional } from './http/controllers/professional/routes'
import { resetPasswordCodesRoutes } from './http/controllers/reset-password-codes/routes'
import { scheduleRoutes } from './http/controllers/schedule/routes'
import { schedulingRoutes } from './http/controllers/scheduling/routes'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'MindHelping API 🧠',
      version: '1.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(personRoutes)
app.register(routesProfessional)
app.register(routesGoal)
app.register(hourliesRoutes)
app.register(scheduleRoutes)
app.register(schedulingRoutes)
app.register(feelingsUserRoutes)
app.register(dailysRoutes)
app.register(cvvCallsRoutes)
app.register(resetPasswordCodesRoutes)
