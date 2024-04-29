import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit Question (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[Put] /questions/:questionId', async () => {
    const user = await studentFactory.makeDbStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const result = await questionFactory.makeDbQuestion({
      authorId: user.id,
    })
    const questionId = result.id.toString()

    const attachment1 = await attachmentFactory.makeDbAttachment()
    const attachment2 = await attachmentFactory.makeDbAttachment()
    await questionAttachmentFactory.makeDbQuestionAttachment({
      questionId: result.id,
      attachmentId: attachment1.id,
    })
    await questionAttachmentFactory.makeDbQuestionAttachment({
      questionId: result.id,
      attachmentId: attachment2.id,
    })

    const attachment3 = await attachmentFactory.makeDbAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Título atualizado!',
        content: 'Conteúdo atualizado!',
        attachments: [attachment3.id.toString(), attachment1.id.toString()],
      })

    const question = await db.question.findFirst()
    expect(response.status).toBe(204)
    expect(question).toEqual(
      expect.objectContaining({ title: 'Título atualizado!' }),
    )

    const questionAttachments = await db.attachment.findMany({
      where: {
        questionId: question?.id.toString(),
      },
    })

    expect(questionAttachments).toHaveLength(2)
    expect(questionAttachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment1.id.toString() }),
        expect.objectContaining({ id: attachment3.id.toString() }),
      ]),
    )
  })
})
