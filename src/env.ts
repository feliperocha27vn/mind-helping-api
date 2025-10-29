import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  EMAIL_FROM: z.email(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
})

export const env = envSchema.parse(process.env)
