import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default (<Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    // Use db push to create the schema but skip client generation
    // Prisma Client should already be generated before running tests (via package.json script)
    execSync('npx prisma db push --force-reset --skip-generate', {
      stdio: 'ignore', // Suppress output to avoid cluttering test results
    })

    return {
      async teardown() {
        // Import prisma here to use the correct instance with the test schema
        const { prisma } = await import('../../src/lib/prisma.js')

        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
          )
        } catch (error) {
          // Ignore errors during cleanup
          console.warn(`Failed to cleanup schema ${schema}:`, error)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
})
