import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { AuthenticateStudentUseCase } from '@/domain/student/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/student/application/use-cases/register-student'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestion } from './controllers/answer-question'
import { Authenticate } from './controllers/authenticate'
import { CreateAccount } from './controllers/create-account'
import { CreateQuestion } from './controllers/create-question'
import { DeleteQuestion } from './controllers/delete-question'
import { EditQuestion } from './controllers/edit-question'
import { FetchRecentQuestions } from './controllers/fetch-recent-questions'
import { GetQuestionBySlug } from './controllers/get-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccount,
    Authenticate,
    FetchRecentQuestions,
    GetQuestionBySlug,
    CreateQuestion,
    AnswerQuestion,
    EditQuestion,
    DeleteQuestion,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    CreateQuestionUseCase,
    AnswerQuestionUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
  ],
})
export class HttpModule {}
