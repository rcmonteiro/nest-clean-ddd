import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { Student } from '../../enterprise/entities/student'
import { RegisterStudentUseCase } from './register-student'

let fakeHasher: FakeHasher
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: RegisterStudentUseCase

describe('Register Student Use Case (unit tests)', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@me',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.student).toBeInstanceOf(Student)
      expect(inMemoryStudentsRepository.items[0].id).toEqual(
        result.value?.student.id,
      )
    }
  })

  it('should be able to hash the password before registering a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@me',
      password: '123123',
    })

    const hashedPassword = await fakeHasher.hash('123123')

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.student).toBeInstanceOf(Student)
      expect(inMemoryStudentsRepository.items[0].password).toEqual(
        hashedPassword,
      )
    }
  })
})
