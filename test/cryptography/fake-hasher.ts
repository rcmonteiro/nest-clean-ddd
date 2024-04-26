import { HashComparator } from '@/domain/student/application/criptography/hash-comparator'
import { HashGenerator } from '@/domain/student/application/criptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparator {
  async compare(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async hash(plain: string, hashed: string): Promise<boolean> {
    return plain.concat('-hashed') === hashed
  }
}
