import { config } from 'dotenv'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { Redis } from 'ioredis'
import { randomUUID } from 'node:crypto'

config({
  path: '.env',
  override: true,
})
config({
  path: '.env.test',
  override: true,
})

const env = envSchema.parse(process.env)

const db = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

const generateUniqueDbURL = (schemaId: string) => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const e2eDbURL = generateUniqueDbURL(schemaId)
  process.env.DATABASE_URL = e2eDbURL
  DomainEvents.shouldRun = false
  await redis.flushdb()
  execSync('pnpm prisma migrate deploy')
  await db.$connect()
})

afterAll(async () => {
  await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await db.$disconnect()
})
