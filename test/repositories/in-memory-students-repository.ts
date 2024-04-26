import { DomainEvents } from '@/core/events/domain-events'
import { StudentsRepository } from '@/domain/student/application/repositories/students-repository'
import { Student } from '@/domain/student/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find((item) => item.id.toString() === id)
    return student ?? null
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email)
    return student ?? null
  }

  async create(student: Student): Promise<void> {
    this.items.push(student)
    DomainEvents.dispatchEventsForAggregate(student.id)
  }
}
