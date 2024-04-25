import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'

const db = new PrismaClient()

const generateUniqueDbURL = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const e2eDbURL = generateUniqueDbURL(schemaId)
  process.env.DATABASE_URL = e2eDbURL
  execSync('pnpm prisma migrate deploy')
  await db.$connect()
})

afterAll(async () => {
  await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await db.$disconnect()
})
