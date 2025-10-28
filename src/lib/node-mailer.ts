import { env } from '@/env'
import { createTransport } from 'nodemailer'

export const transporterConfig = createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: env.EMAIL_FROM,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
  },
})
