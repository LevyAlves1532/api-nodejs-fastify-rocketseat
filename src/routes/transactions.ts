import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'

import { knex } from '../database.js'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js'

// Cookies <-> Formas da gente manter contexto entre requisições

// Unitários: unidade de sua aplicação
// Integração: Comunicação entre duas ou mais unidades
// e2e - ponta a ponta: Simulam um usuário operando na nossa aplicação

// front-end: abre a página de login, digite o texto diego@rocketseat.com.br no campo com ID email, clique no botão
// back-end: chamadas HTTP, WebSockets

// Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura de software)
// 2000 testes -> Testes E2E => 16min

export async function transcationsRoutes(app: FastifyInstance) {
  // Contexto global do plugin
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const getTransactionParamSchema = z.object({
        id: z.uuid(),
      })

      const { id } = getTransactionParamSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // HTTP Codes
    // 201 - Recurso criado com sucesso

    return reply.status(201).send()
  })
}
