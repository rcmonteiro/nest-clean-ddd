import { Question } from '@/domain/forum/enterprise/entities/question'

export abstract class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id,
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
