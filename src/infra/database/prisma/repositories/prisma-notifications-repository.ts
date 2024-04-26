import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
    return Promise.resolve()
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id)
    if (index >= 0) {
      this.items[index] = notification
    }
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id)
    if (!notification) {
      return null
    }
    return notification
  }
}