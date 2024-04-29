import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[Delete] /answers/:answerId', async () => {
    const user = await studentFactory.makeDbStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const question = await questionFactory.makeDbQuestion({
      authorId: user.id,
    })

    const result = await answerFactory.makeDbAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerId = result.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const answer = await db.answer.findFirst()
    expect(response.status).toBe(204)
    expect(answer).toBeFalsy()
  })
})
