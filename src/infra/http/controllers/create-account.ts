import { StudentAlreadyExistsError } from '@/domain/student/application/use-cases/errors/student-already-exists-error'
import { RegisterStudentUseCase } from '@/domain/student/application/use-cases/register-student'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type TCreateAccount = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccount {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: TCreateAccount) {
    const { name, email, password } = body
    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
