import { Student } from '@/domain/student/enterprise/entities/student'

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<void>
  abstract findById(id: string): Promise<Student | null>
  abstract findByEmail(email: string): Promise<Student | null>
}
