import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type TPageQuery = z.infer<typeof pageQuerySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestions {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query('page', queryValidationPipe) page: TPageQuery) {
    const questions = await this.fetchRecentQuestions.execute({ page })

    return { questions }
  }
}
