import { Module } from '@nestjs/common'
import { CreateAccount } from './controllers/create-account'
import { PrismaService } from './prisma/prisma.service'

@Module({
  controllers: [CreateAccount],
  providers: [PrismaService],
})
export class AppModule {}
