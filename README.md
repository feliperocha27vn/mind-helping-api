# Mind Helping API

> API RESTful para gerenciamento de agendamentos entre profissionais de saúde mental e usuários.

## 📋 Sumário

- [Visão Geral](#visão-geral)
# Mind Helping API

API RESTful para gerenciamento de agendamentos entre profissionais de saúde mental e usuários.

> Este README foi enriquecido para ajudar novos colaboradores e consumidores da API a entenderem rapidamente o funcionamento, arquitetura, scripts e como contribuir.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Quick Start (rápido)](#quick-start-rápido)
- [Scripts úteis](#scripts-úteis)
- [Arquitetura e convenções](#arquitetura-e-convenções)
- [Pontos importantes do design](#pontos-importantes-do-design)
- [Endpoints e documentação (Swagger/OpenAPI)](#endpoints-e-documentação-swaggeropenapi)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados e Prisma](#banco-de-dados-e-prisma)
- [Testes (unit / e2e)](#testes-unit--e2e)
- [Como adicionar uma rota corretamente](#como-adicionar-uma-rota-corretamente)
- [Dicas de debugging comuns](#dicas-de-debugging-comuns)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Visão Geral

A Mind Helping API é um backend TypeScript que oferece recursos para cadastro de usuários e profissionais, criação de agendas (schedules), geração de horários (hourlies), agendamentos (scheduling), e um sistema simples de metas (goals). O projeto segue uma variação da Clean Architecture com separação clara entre controllers (HTTP), use-cases (regras de negócio) e repositórios (infra).

## Quick Start (rápido)

Pré-requisitos:
- Node.js 18+
- PostgreSQL (local ou via Docker)
- pnpm (recomendado) ou npm

Passos rápidos:

```bash
# Clone
git clone https://github.com/feliperocha27vn/mind-helping-api.git
cd mind-helping-api

# Instale dependências
pnpm install

# Copie variáveis de ambiente e edite .env (DATABASE_URL etc.)
cp .env.example .env

# Rode migrations e gere Prisma Client
npx prisma migrate dev

# Inicie a app
pnpm dev

# Abra a documentação (Swagger UI)
http://localhost:3333/docs
```

> Observação: Para testes E2E a base precisa estar configurada (migrations aplicadas). Em ambientes de CI você pode usar um banco Postgres temporário ou docker-compose.

## Scripts úteis

Use os scripts definidos no `package.json`:

- `pnpm dev` — roda servidor em modo desenvolvimento (usa `tsx watch`) e abre Prisma Studio via outro script
- `pnpm dev:server` — apenas servidor
- `pnpm dev:db` — abre Prisma Studio
- `pnpm build` — build com tsup
- `pnpm test` — executa testes unitários (projeto `unit`)
- `pnpm test:e2e` — executa testes e2e (projeto `e2e`)
- `pnpm test:coverage` — gera cobertura

## Arquitetura e convenções

Estrutura principal:

```
src/
├─ app.ts                # Configuração do Fastify (plugins, swagger, type provider)
├─ server.ts             # Entrypoint que inicia o servidor
├─ env.ts                # Validação das variáveis de ambiente
├─ http/controllers/     # Rotas e handlers (Fastify plugins)
├─ use-cases/            # Casos de uso (regras de negócio)
├─ repositories/         # Interfaces de repositórios (infra abstractions)
│  └─ prisma/            # Implementações com Prisma
├─ in-memory-repository/ # Implementações em memória para testes unitários
├─ factories/            # Fabricação de instâncias (injeção simples)
├─ lib/                  # Helpers e configurações (ex: prisma client)
└─ utils/                # Utilitários (tests helpers, parse helpers)
```

Padrões estabelecidos:
- Cada rota é implementada como `FastifyPluginAsyncZod` (tipo vindo de `fastify-type-provider-zod`).
- Schemas de rota são definidos com Zod (body, params, querystring, response).
- Repositórios definem interfaces em `src/repositories/*` e implementações em `src/repositories/prisma/*`.
- Testes unitários usam repositórios `in-memory` para isolar regras de negócio.

## Pontos importantes do design

- Zod + fastify-type-provider-zod: validação e serialização são configuradas em `app.ts` com `setValidatorCompiler` e `setSerializerCompiler`. A lib também provê `jsonSchemaTransform` para integrar com `@fastify/swagger` e gerar o OpenAPI a partir dos schemas Zod.
- Separação de responsabilidades: Controllers só lidam com HTTP + tratamento de erro; regras de negócio ficam em use-cases; repositórios cuidam da persistência.
- Factories: facilitém a troca de implementações (Prisma vs InMemory) para testes.

## Endpoints e documentação (Swagger/OpenAPI)

O projeto expõe Swagger UI via `@fastify/swagger` + `@fastify/swagger-ui`. A URL por padrão é:

```
http://localhost:3333/docs
```

Notas sobre documentação:
- Para que as descrições e schemas apareçam corretamente no Swagger, o projeto utiliza `jsonSchemaTransform` (ver `src/app.ts`). Use `z.describe(...)` para descrever propriedades quando precisar que a descrição apareça no OpenAPI.

Exemplo de rota (resumido):

```ts
app.post('/dailys/:userId', {
  schema: {
    tags: ['Dailys'],
    description: 'Cria um novo diário para o usuário especificado.',
    params: z.object({ userId: z.uuid() }),
    body: z.object({ content: z.string().min(1) }),
    response: { 201: z.void(), 404: z.object({ message: z.string() }) }
  }
}, handler)
```

## Variáveis de ambiente (exemplos)

As variáveis esperadas estão em `.env.example`. Principais:

- `DATABASE_URL` — connection string do Postgres
- `PORT` — porta do servidor (opcional; padrão 3333 no README)
- `NODE_ENV` — environment (development/test/production)

Adicione outras variáveis sensíveis ao arquivo `.env` local e não comite as credenciais.

## Banco de dados e Prisma

O projeto usa Prisma como ORM. Comandos comuns:

- Gerar client (após modificar schema): `npx prisma generate`
- Criar migration: `npx prisma migrate dev --name <nome>`
- Aplicar migrations em produção: `npx prisma migrate deploy`
- Abrir Prisma Studio: `npx prisma studio`

Modelo importante: `Person` é a entidade central. `User` e `Professional` são relacionadas a `Person` via `person_id`.

IMPORTANTE: Ao atualizar dados, se você enviar campos pertencentes a `Person` para uma atualização em `User` (ou vice-versa) com a implementação Prisma, isso pode causar erro; sempre separe os dados de `person` dos dados de `user` antes de chamar `prisma.user.update`.

## Testes (unit e e2e)

Estrutura de testes:

- Unit: `src/use-cases/**` (testes com InMemory repositories)
- E2E: `src/http/controllers/**.test.ts` (testam a stack completa usando banco real)

Executando testes:

```bash
# unit
pnpm test

# e2e
pnpm test:e2e

# rodar um único arquivo (exemplo)
npx vitest run src/http/controllers/person/update-user.test.ts --project e2e
```

Dicas para E2E:
- Certifique-se que as migrations foram aplicadas e que `DATABASE_URL` aponta para um banco de testes limpo.
- Para debugar falhas que retornam 500, adicione logs temporários no `catch` do controller ou execute o teste localmente e inspecione o stack trace gerado pelo Prisma.

## Como adicionar uma rota corretamente

1. Crie um arquivo em `src/http/controllers/<module>/nome-da-rota.ts` exportando `FastifyPluginAsyncZod`.
2. Declare `schema` com Zod (params, querystring, body, response). Use `description:` no schema para documentar a rota.
3. Crie o use-case em `src/use-cases` se for lógica de negócio nova.
4. Adicione (se necessário) métodos no repositório e implemente em `src/repositories/prisma`.
5. Escreva testes unitários para o use-case (InMemory) e testes E2E para o controller.

## Dicas de debugging comuns

- 500 genérico no controller: adicione `console.error(error)` no catch do controller para capturar stack trace; isso ajuda a identificar erros do Prisma ou violações de contrato.
- Diferença entre unit e e2e: Unit usa repositórios in-memory que não validam campos como o Prisma — por isso erros de schema só aparecem em E2E.
- Swagger sem descrições: verifique se `app.register(fastifySwagger, { transform: jsonSchemaTransform })` está presente (ver `src/app.ts`). Use a aba "Schema" na UI do Swagger para ver descrições de propriedades.

## Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Abra um PR descrevendo a mudança e os passos para testar

Boas práticas:

- Escreva testes para novas funcionalidades (unit + e2e quando aplicável)
- Adicione `description` nos schemas Zod para melhorar o OpenAPI
- Use `in-memory` repos para testes unitários

## Licença

MIT

---

Se quiser, eu posso também:

- Gerar um checklist de revisão para PRs (testes, lint, run e2e)
- Criar um documento `DEVELOPMENT.md` com passos detalhados de debugging e onboarding

Se quiser que eu adicione qualquer outro detalhe (ex.: exemplos de curl para cada endpoint, instruções Docker Compose, ou templates de PR), diga qual seção prefere que eu expanda.
