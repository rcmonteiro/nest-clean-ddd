import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
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
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
