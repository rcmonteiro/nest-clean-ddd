export abstract class HashComparator {
  abstract execute(plain: string, hashed: string): Promise<boolean>
}
