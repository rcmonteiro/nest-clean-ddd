import { ValueObject } from '@/core/entities/value-object'

export class Slug extends ValueObject<string> {
  public value: string

  private constructor(value: string) {
    super(value)
    this.value = value
  }

  static create(value: string) {
    return new Slug(value)
  }

  /**
   * Recebe uma `string` e normaliza ela como um `slug`
   *
   * Exemplo:
   *   - "Olá, mundo!" => "ola-mundo"
   * @param text {string}
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')
    return new Slug(slugText)
  }
}
