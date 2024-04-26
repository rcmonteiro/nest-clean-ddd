import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  return shouldSuccess ? right(10) : left('error')
}

describe('Either', () => {
  it('success result', () => {
    const result = doSomething(true)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
  })
  it('error result', () => {
    const result = doSomething(false)

    expect(result.isRight()).toBe(false)
    expect(result.isLeft()).toBe(true)
  })
})
