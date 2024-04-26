import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '@/domain/student/application/repositories/students-repository'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../criptography/encrypter'
import { HashComparator } from '../criptography/hash-comparator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparator: HashComparator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparator.execute(
      password,
      student.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.execute({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
