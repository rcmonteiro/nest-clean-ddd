import { Slug } from './slug'

test('should create a slug from text', () => {
  const slug = Slug.createFromText('Ola, mundo!')
  expect(slug.value).toEqual('ola-mundo')
})
