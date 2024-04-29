import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { AuthenticateStudentUseCase } from '@/domain/student/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/student/application/use-cases/register-student'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestion } from './controllers/answer-question'
import { Authenticate } from './controllers/authenticate'
import { ChooseQuestionBestAnswer } from './controllers/choose-question-best-answer'
import { CommentOnAnswer } from './controllers/comment-on-answer'
import { CommentOnQuestion } from './controllers/comment-on-question'
import { CreateAccount } from './controllers/create-account'
import { CreateQuestion } from './controllers/create-question'
import { DeleteAnswer } from './controllers/delete-answer'
import { DeleteAnswerComment } from './controllers/delete-answer-comment'
import { DeleteQuestion } from './controllers/delete-question'
import { DeleteQuestionComment } from './controllers/delete-question-comment'
import { EditAnswer } from './controllers/edit-answer'
import { EditQuestion } from './controllers/edit-question'
import { FetchAnswerComments } from './controllers/fetch-answer-comments'
import { FetchQuestionAnswers } from './controllers/fetch-question-answers'
import { FetchQuestionComments } from './controllers/fetch-question-comments'
import { FetchRecentQuestions } from './controllers/fetch-recent-questions'
import { GetQuestionBySlug } from './controllers/get-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccount,
    Authenticate,
    FetchRecentQuestions,
    FetchQuestionAnswers,
    FetchQuestionComments,
    FetchAnswerComments,
    GetQuestionBySlug,
    CreateQuestion,
    AnswerQuestion,
    EditAnswer,
    EditQuestion,
    DeleteQuestion,
    DeleteAnswer,
    ChooseQuestionBestAnswer,
    CommentOnQuestion,
    CommentOnAnswer,
    DeleteQuestionComment,
    DeleteAnswerComment,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    FetchRecentQuestionsUseCase,
    FetchQuestionAnswersUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    GetQuestionBySlugUseCase,
    CreateQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    DeleteAnswerUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
  ],
})
export class HttpModule {}
