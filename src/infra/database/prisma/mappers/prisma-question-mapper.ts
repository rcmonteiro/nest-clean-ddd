import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export abstract class PrismaQuestionMapper {
  public static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        bestAnswerId: undefined,
        title: raw.title,
        slug: Slug.create(raw.slug),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
