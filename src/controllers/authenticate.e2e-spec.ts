import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let db: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await db.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@me.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@me.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
