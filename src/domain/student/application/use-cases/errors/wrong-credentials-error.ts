import { UseCaseError } from '@/core/error/use-case-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Invalid Credentials')
  }
}
