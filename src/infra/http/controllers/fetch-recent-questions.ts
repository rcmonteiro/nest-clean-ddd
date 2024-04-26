import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
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
  constructor(private db: PrismaService) {}

  private readonly PAGE_SIZE = 20

  @Get()
  @HttpCode(200)
  async handle(@Query('page', queryValidationPipe) page: TPageQuery) {
    const questions = await this.db.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: this.PAGE_SIZE,
      skip: (page - 1) * this.PAGE_SIZE,
    })

    return { questions }
  }
}
