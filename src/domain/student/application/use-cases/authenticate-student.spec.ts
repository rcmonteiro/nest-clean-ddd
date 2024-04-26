import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: AuthenticateStudentUseCase

describe('Authenticate Student Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'john-doe@me',
      password: await fakeHasher.hash('123123'),
    })
    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      email: 'john-doe@me',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
    }
  })
})
