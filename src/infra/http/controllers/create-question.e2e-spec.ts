import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Question (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await db.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@me.com',
        password: '123123',
      },
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question title',
        content: 'New question content',
      })

    const question = await db.question.findFirst()
    expect(response.status).toBe(201)
    expect(question).toEqual(
      expect.objectContaining({ title: 'New question title' }),
    )
  })
})
