import { StudentsRepository } from '@/domain/student/application/repositories/students-repository'
import { Student } from '@/domain/student/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private db: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.db.user.findUnique({
      where: { id },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.db.user.findUnique({
      where: { email },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.db.user.create({
      data,
    })
  }
}
