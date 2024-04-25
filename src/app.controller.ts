import { Controller, Get } from '@nestjs/common'
import { PrismaPromise, User } from '@prisma/client'
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
  constructor(private readonly db: PrismaService) {}

  @Get('/hello')
  getHello(): PrismaPromise<User[]> {
    return this.db.user.findMany()
  }
}
