export abstract class Encrypter {
  abstract execute(payload: Record<string, unknown>): Promise<string>
}
