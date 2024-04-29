import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export const makeAttachment = (
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
) => {
  const newAttachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )
  return newAttachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private db: PrismaService) {}

  async makeDbAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.db.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
