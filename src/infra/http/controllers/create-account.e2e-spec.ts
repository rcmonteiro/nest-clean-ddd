import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (e2e)', () => {
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

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@me.com',
      password: '123456',
    })

    const user = await db.user.findUnique({
      where: { email: 'john.doe@me.com' },
    })
    expect(response.status).toBe(201)
    expect(user).toBeTruthy()
  })
})
