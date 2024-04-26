import { HashComparator } from '@/domain/student/application/criptography/hash-comparator'
import { HashGenerator } from '@/domain/student/application/criptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparator {
  private readonly HASH_SALT = 8

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT)
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return await compare(plain, hashed)
  }
}
