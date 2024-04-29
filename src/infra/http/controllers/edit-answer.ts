import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TTokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

const editAnswer = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

type TEditAnswer = z.infer<typeof editAnswer>

const bodyValidationPipe = new ZodValidationPipe(editAnswer)

@Controller('/answers/:answerId')
export class EditAnswer {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @Body(bodyValidationPipe) body: TEditAnswer,
    @CurrentUser() user: TTokenPayload,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: userId,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
