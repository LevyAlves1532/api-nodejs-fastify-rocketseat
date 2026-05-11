# api-transacoes - API de Transações

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-Tipagem-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Fastify-HTTP-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/SQLite-Banco-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Knex-Query%20Builder-D26B38?style=for-the-badge" alt="Knex">
</p>

---

## Sobre o Projeto

O **api-transacoes** é uma API HTTP simples para **criação e consulta de transações**, com persistência em **SQLite** e separação de dados por **sessão via cookie** (`sessionId`).

Este projeto é um dos projetos desenvolvidos durante um curso da **Rocketseat**.

### Funcionalidades Principais

- Criar transações de crédito e débito
- Listar transações por sessão
- Consultar transação por ID (UUID) por sessão
- Retornar sumário (soma) por sessão
- Migrations do banco com Knex
- Testes e2e com Vitest + Supertest

---

## Tecnologias Utilizadas

- **Runtime**: Node.js
- **Linguagem**: TypeScript (ESM)
- **HTTP**: Fastify + `@fastify/cookie`
- **Validação**: Zod
- **Banco**: SQLite3
- **Query Builder / Migrations**: Knex
- **Testes**: Vitest + Supertest

---

## Como Iniciar

### Requisitos

- Node.js instalado
- npm (vem junto com o Node)

### Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie o arquivo `.env` com base no `.env.example`:
   - `DATABASE_URL`: caminho do arquivo do SQLite (ex.: `./db/dev.db`)
   - `PORT`: opcional (padrão: `3333`)

3. Execute as migrations:
   ```bash
   npm run knex migrate:latest
   ```

### Execução em Desenvolvimento

```bash
npm run dev
```

Servidor: `http://localhost:3333`

### Testes

1. Crie o arquivo `.env.test` com base no `.env.test.example`.
2. Rode:
   ```bash
   npm test
   ```

Observação: os testes executam rollback/execução das migrations antes de cada caso de teste.

---

## Estrutura do Projeto

- **`src/server.ts`**: inicialização do servidor (listen).
- **`src/app.ts`**: instancia e configura o Fastify (plugins e registro de rotas).
- **`src/env/index.ts`**: carregamento e validação de variáveis de ambiente.
- **`src/database.ts`**: configuração do Knex e conexão com SQLite.
- **`src/routes/transactions.ts`**: rotas HTTP de transações.
- **`src/middlewares/check-session-id-exists.ts`**: valida existência do cookie `sessionId`.
- **`db/migrations/`**: migrations do banco.
- **`test/transactions.spec.ts`**: testes e2e.

---

## Rotas da API

Prefixo: `/transactions`

### Criar transação

`POST /transactions`

Body:
```json
{
  "title": "Salário",
  "amount": 5000,
  "type": "credit"
}
```

Notas:
- Se não existir `sessionId`, a API cria e retorna um cookie `sessionId`.
- `type: debit` grava o `amount` como valor negativo.

Exemplo (curl):
```bash
curl -i -X POST http://localhost:3333/transactions ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Salário\",\"amount\":5000,\"type\":\"credit\"}"
```

### Listar transações (por sessão)

`GET /transactions`

Requer cookie `sessionId`. Exemplo:
```bash
curl -i http://localhost:3333/transactions ^
  -H "Cookie: sessionId=SEU_SESSION_ID"
```

### Buscar transação por ID (por sessão)

`GET /transactions/:id`

`id` deve ser UUID. Exemplo:
```bash
curl -i http://localhost:3333/transactions/UUID_DA_TRANSACAO ^
  -H "Cookie: sessionId=SEU_SESSION_ID"
```

### Sumário (por sessão)

`GET /transactions/summary`

Exemplo:
```bash
curl -i http://localhost:3333/transactions/summary ^
  -H "Cookie: sessionId=SEU_SESSION_ID"
```

---

## Scripts (npm)

- `npm run dev`: sobe o servidor em modo watch (`tsx watch`).
- `npm run knex`: executa o CLI do Knex (migrations, etc.).
- `npm run lint`: roda o ESLint (com autofix).
- `npm test`: roda a suíte de testes (Vitest).
- `npm run build`: gera build via `tsup` em `build/`.
