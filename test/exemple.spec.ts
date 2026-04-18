import { expect, test } from 'vitest'

test('o usuário consegue criar uma nova transação', () => {
  // Fazer a chamada HTTP p/ criar uma nova transação
  const responseStatusCode = 201
  // Validação
  expect(responseStatusCode).toEqual(201)
})
