import fastify from 'fastify'
// import crypto from 'node:crypto'

import { knex } from './database.js'
import { env } from './env/index.js'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

// http://localhost:3333/hello

app.get('/hello', async () => {
  // const transcation = await knex('transactions')
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: 'Transação de teste',
  //     amount: 1000,
  //   })
  //   .returning('*')

  const transactions = await knex('transactions')
    .where('amount', 500)
    .select('*')

  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })

// EcmaScript Lint
