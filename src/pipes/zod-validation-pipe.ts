import { BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Bad Request',
          errors: error.flatten().fieldErrors,
          statusCode: 400,
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
