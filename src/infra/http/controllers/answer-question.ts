import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TTokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type TAnswerQuestion = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestion {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: TAnswerQuestion,
    @CurrentUser() user: TTokenPayload,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.answerQuestion.execute({
      questionId,
      content,
      authorId: userId,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
