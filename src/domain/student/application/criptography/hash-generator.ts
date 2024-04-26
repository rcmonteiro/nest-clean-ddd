export abstract class HashGenerator {
  abstract compare(plain: string): Promise<string>
}
