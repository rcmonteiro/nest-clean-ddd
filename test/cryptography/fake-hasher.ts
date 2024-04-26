import { HashComparator } from '@/domain/student/application/criptography/hash-comparator'
import { HashGenerator } from '@/domain/student/application/criptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain.concat('-hashed') === hashed
  }
}
