import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Create Notification Use Case (unit tests)', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova pergunta',
      content: 'Usuário Yoda postou uma nova pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification).toBeInstanceOf(Notification)
    expect(result.value?.notification.content).toEqual(
      'Usuário Yoda postou uma nova pergunta',
    )
    expect(inMemoryNotificationsRepository.items[0].id).toEqual(
      result.value?.notification.id,
    )
  })
})
