import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Authenticate } from './controllers/authenticate'
import { CreateAccount } from './controllers/create-account'
import { CreateQuestion } from './controllers/create-question'
import { FetchRecentQuestions } from './controllers/fetch-recent-questions'

@Module({
  controllers: [
    CreateAccount,
    Authenticate,
    CreateQuestion,
    FetchRecentQuestions,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
