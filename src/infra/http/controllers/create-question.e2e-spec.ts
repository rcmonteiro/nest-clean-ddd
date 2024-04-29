import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Create Question (e2e)', () => {
  let app: INestApplication
  let db: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    db = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await studentFactory.makeDbStudent()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const attachment1 = await attachmentFactory.makeDbAttachment()
    const attachment2 = await attachmentFactory.makeDbAttachment()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question title',
        content: 'New question content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    const question = await db.question.findFirst()
    expect(response.status).toBe(201)
    expect(question).toEqual(
      expect.objectContaining({ title: 'New question title' }),
    )

    const questionAttachments = await db.attachment.findMany({
      where: {
        questionId: question?.id.toString(),
      },
    })

    expect(questionAttachments).toHaveLength(2)
  })
})
