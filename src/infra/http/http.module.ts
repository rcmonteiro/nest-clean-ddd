import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { Authenticate } from './controllers/authenticate'
import { CreateAccount } from './controllers/create-account'
import { CreateQuestion } from './controllers/create-question'
import { FetchRecentQuestions } from './controllers/fetch-recent-questions'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccount,
    Authenticate,
    CreateQuestion,
    FetchRecentQuestions,
  ],
})
export class HttpModule {}
