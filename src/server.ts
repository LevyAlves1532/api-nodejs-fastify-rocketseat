// import fastify from 'fastify'
// import cookie from '@fastify/cookie'
// // import crypto from 'node:crypto'

// import { env } from './env/index.js'
// import { transcationsRoutes } from './routes/transactions.js'

// const app = fastify()

// // GET, POST, PUT, PATCH, DELETE

// // http://localhost:3333/hello

// app.register(cookie)

// // Contexto global da aplicação
// // app.addHook('preHandler', async (request, reply) => {
// //   console.log(`[${request.method}] ${request.url}`)
// // })

// app.register(transcationsRoutes, {
//   prefix: 'transactions',
// })

// app.get('/hello', () => {
//   return 'Hello World'
// })

import { env } from './env/index.js'
import { app } from './app.js'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })

// EcmaScript Lint
