export abstract class HashGenerator {
  abstract execute(plain: string): Promise<string>
}
