import type { FastifyInstance } from 'fastify'

import { knex } from '../database.js'

export async function transcationsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions')
      .where('amount', 500)
      .select('*')

    return transactions
  })
}
