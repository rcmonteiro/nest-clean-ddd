import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CreateAccount } from './controllers/create-account'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccount],
  providers: [PrismaService],
})
export class AppModule {}
