import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'

export const makeAnswer = (
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) => {
  const newAnswer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      createdAt: faker.date.recent(),
      ...override,
    },
    id,
  )
  return newAnswer
}
