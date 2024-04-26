import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Question by Slug (e2e)', () => {
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

  test('[GET] /questions/:slug', async () => {
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

    await db.question.create({
      data: {
        title: 'New question title 1',
        slug: 'new-question-title-1',
        content: 'New question content-1',
        authorId: user.id,
      },
    })

    const slug = 'new-question-title-1'

    const response = await request(app.getHttpServer())
      .get(`/questions/${slug}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.question).toEqual(
      expect.objectContaining({ title: 'New question title 1' }),
    )
  })
})
