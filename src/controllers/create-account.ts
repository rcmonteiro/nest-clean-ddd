import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccount {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userExists = await this.db.user.findUnique({
      where: { email },
    })

    if (userExists) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
