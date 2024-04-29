import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const comment1 = await makeQuestionComment({
      questionId: new UniqueEntityId('any-question-id'),
      authorId: student.id,
    })
    inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ authorId: student.id }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ authorId: student.id }),
    )

    const result = await sut.execute({
      questionId: 'any-question-id',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(1)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent()
    inMemoryStudentsRepository.items.push(student)

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('any-question-id'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'any-question-id',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
