import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Recent Question (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makeDbStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    await Promise.all([
      questionFactory.makeDbQuestion({
        title: 'New question title 1',
        authorId: user.id,
      }),
      questionFactory.makeDbQuestion({
        title: 'New question title 2',
        authorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(2)
    expect(response.body.questions).toEqual([
      expect.objectContaining({ title: 'New question title 1' }),
      expect.objectContaining({ title: 'New question title 2' }),
    ])
  })
})
