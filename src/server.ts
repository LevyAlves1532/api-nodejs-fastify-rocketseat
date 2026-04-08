import fastify from 'fastify'
import cookie from '@fastify/cookie'
// import crypto from 'node:crypto'

import { env } from './env/index.js'
import { transcationsRoutes } from './routes/transactions.js'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

// http://localhost:3333/hello

app.register(cookie)
app.register(transcationsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })

// EcmaScript Lint
