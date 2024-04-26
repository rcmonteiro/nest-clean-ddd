import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlug {
  constructor(private getGetQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('slug') slug: string) {
    const result = await this.getGetQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { question } = result.value

    return { question: QuestionPresenter.toHTTP(question) }
  }
}
