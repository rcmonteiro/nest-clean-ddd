import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/student/enterprise/entities/student'
import { Prisma, User as PrismaStudent } from '@prisma/client'

export abstract class PrismaStudentMapper {
  public static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  public static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
