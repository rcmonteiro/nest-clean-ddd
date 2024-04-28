import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Answer Question (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makeDbStudent()
    const question = await questionFactory.makeDbQuestion({ authorId: user.id })

    const questionId = question.id.toString()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer question content',
      })

    const answer = await db.answer.findFirst()
    expect(response.status).toBe(201)
    expect(answer).toEqual(
      expect.objectContaining({ content: 'New answer question content' }),
    )
  })
})
