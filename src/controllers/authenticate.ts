import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type TAuthenticate = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class Authenticate {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: TAuthenticate) {
    const { email, password } = body

    const userExists = await this.db.user.findUnique({
      where: { email },
    })

    if (!userExists) {
      throw new ConflictException('Invalid credentials')
    }

    const passwordMatch = await compare(password, userExists.password)

    if (!passwordMatch) {
      throw new ConflictException('Invalid credentials')
    }

    const token = this.jwt.sign({
      sub: userExists.id,
    })
    console.log(token)
    return token
  }
}
