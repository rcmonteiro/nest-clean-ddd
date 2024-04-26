import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type TCreateAccount = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccount {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: TCreateAccount) {
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
