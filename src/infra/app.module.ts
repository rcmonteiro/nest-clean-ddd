import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { Authenticate } from './http/controllers/authenticate'
import { CreateAccount } from './http/controllers/create-account'
import { CreateQuestion } from './http/controllers/create-question'
import { FetchRecentQuestions } from './http/controllers/fetch-recent-questions'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccount,
    Authenticate,
    CreateQuestion,
    FetchRecentQuestions,
  ],
  providers: [PrismaService],
})
export class AppModule {}
