import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Answer Question (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makeDbStudent()
    const question = await questionFactory.makeDbQuestion({ authorId: user.id })

    const questionId = question.id.toString()

    const attachment1 = await attachmentFactory.makeDbAttachment()
    const attachment2 = await attachmentFactory.makeDbAttachment()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer question content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    const answer = await db.answer.findFirst()
    expect(response.status).toBe(201)
    expect(answer).toEqual(
      expect.objectContaining({ content: 'New answer question content' }),
    )

    const attachmentsOnDatabase = await db.attachment.findMany({
      where: {
        answerId: answer?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
