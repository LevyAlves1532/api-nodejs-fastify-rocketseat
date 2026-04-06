import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { knex } from '../database.js'

export async function transcationsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // { title, amount, type: credit ou debit }

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    // HTTP Codes
    // 201 - Recurso criado com sucesso

    return reply.status(201).send()
  })
}
