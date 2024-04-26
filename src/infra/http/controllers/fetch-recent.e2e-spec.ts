import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Recent Question (e2e)', () => {
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

  test('[GET] /questions', async () => {
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

    await db.question.createMany({
      data: [
        {
          title: 'New question title 1',
          slug: 'new-question-title-1',
          content: 'New question content-1',
          authorId: user.id,
        },
        {
          title: 'New question title 2',
          slug: 'new-question-title-2',
          content: 'New question content-2',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(2)
    expect(response.body.questions).toEqual([
      expect.objectContaining({ title: 'New question title 1' }),
      expect.objectContaining({ title: 'New question title 2' }),
    ])
  })
})
