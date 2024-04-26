import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  private readonly PAGE_SIZE = 20

  constructor(private db: PrismaService) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.db.question.findUnique({ where: { slug } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.db.question.findUnique({ where: { id } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.db.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: this.PAGE_SIZE,
      skip: (page - 1) * this.PAGE_SIZE,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.db.question.create({
      data,
    })
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.db.question.update({ where: { id: data.id }, data })
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(id: string): Promise<void> {
    await this.db.question.delete({ where: { id } })
  }
}
