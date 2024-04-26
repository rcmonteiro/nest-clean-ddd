export abstract class HashComparator {
  abstract hash(plain: string, hashed: string): Promise<boolean>
}
