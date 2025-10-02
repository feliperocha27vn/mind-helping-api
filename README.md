# Mind Helping API

> API RESTful para gerenciamento de agendamentos entre profissionais de saúde mental e usuários.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Arquitetura](#arquitetura)
- [Módulos e Funcionalidades](#módulos-e-funcionalidades)
- [API Endpoints](#api-endpoints)
- [Validação de Dados](#validação-de-dados)
- [Testes](#testes)
- [Banco de Dados](#banco-de-dados)

---

## 🎯 Visão Geral

A **Mind Helping API** é uma aplicação backend desenvolvida para facilitar o gerenciamento de consultas e agendamentos entre profissionais de saúde mental (psicólogos) e usuários/pacientes.

### Principais Funcionalidades:

- ✅ Cadastro de profissionais e usuários
- ✅ Criação e gerenciamento de agendas (schedules)
- ✅ Criação automática de horários disponíveis (hourlies)
- ✅ Agendamento de consultas (scheduling)
- ✅ Sistema de metas (goals) para usuários
- ✅ Validação inteligente de datas e horários com suporte a múltiplos formatos
- ✅ Gerenciamento de timezone (UTC)

---

## 🚀 Tecnologias

### Core
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Fastify** - Framework web de alta performance
- **Prisma** - ORM para PostgreSQL

### Validação e Documentação
- **Zod** - Validação de schemas TypeScript-first
- **Fastify Swagger** - Documentação automática da API
- **Fastify Type Provider Zod** - Integração Fastify + Zod

### Testes
- **Vitest** - Framework de testes unitários e E2E
- **Supertest** - Testes de integração HTTP

### Utilitários
- **date-fns** - Manipulação de datas
- **bcryptjs** - Hash de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- pnpm (ou npm/yarn)

### Passos

```bash
# Clone o repositório
git clone https://github.com/feliperocha27vn/mind-helping-api.git
cd mind-helping-api

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrations do Prisma
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
pnpm dev
```

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor + Prisma Studio
pnpm dev:server       # Apenas o servidor
pnpm dev:db           # Apenas o Prisma Studio

# Testes
pnpm test             # Testes unitários
pnpm test:watch       # Testes unitários em modo watch
pnpm test:e2e         # Testes de integração E2E
pnpm test:e2e:watch   # Testes E2E em modo watch
pnpm test:coverage    # Testes com cobertura
```

---

## 🏗️ Arquitetura

A aplicação segue os princípios de **Clean Architecture** e **SOLID**:

```
src/
├── app.ts                      # Configuração do Fastify
├── server.ts                   # Inicialização do servidor
├── env.ts                      # Validação de variáveis de ambiente
├── errors/                     # Erros customizados
├── http/
│   └── controllers/            # Controllers (rotas + handlers)
├── use-cases/                  # Casos de uso (regras de negócio)
├── repositories/               # Interfaces de repositórios
│   ├── prisma/                 # Implementações Prisma
├── in-memory-repository/       # Implementações in-memory (testes)
├── factories/                  # Factory Pattern para dependências
├── utils/                      # Funções utilitárias
└── lib/                        # Configurações de bibliotecas
```

### Padrões Utilizados

- **Repository Pattern**: Abstração de acesso a dados
- **Factory Pattern**: Criação de instâncias de use cases
- **Dependency Injection**: Inversão de controle
- **DTO Pattern**: Data Transfer Objects para requests/responses

---

## 🎯 Módulos e Funcionalidades

### 1. **Person (Pessoa)**

Gerenciamento de dados pessoais base para profissionais e usuários.

**Funcionalidades:**
- Cadastro de pessoa com informações completas
- Validação de email único
- Hash de senhas com bcrypt

### 2. **Professional (Profissional)**

Gerenciamento de profissionais de saúde mental.

**Funcionalidades:**
- Cadastro de profissional vinculado a uma pessoa
- Registro de CRP (Conselho Regional de Psicologia)
- Suporte para profissionais voluntários (atendimento gratuito)
- Listagem de profissionais
- Busca por ID

### 3. **User (Usuário/Paciente)**

Gerenciamento de usuários/pacientes.

**Funcionalidades:**
- Cadastro de usuário vinculado a uma pessoa
- Registro de gênero
- Sistema de metas pessoais

### 4. **Schedule (Agenda)**

Gerenciamento de agendas dos profissionais.

**Funcionalidades:**
- Criação de múltiplas agendas por profissional
- Configuração de:
  - Horário inicial e final
  - Intervalo entre consultas
  - Valor médio da consulta
  - Política de cancelamento (horas)
  - Observações
  - Modo controlado (cria horários automaticamente)
- Listagem de agendas por profissional

### 5. **Hourly (Horários)**

Gerenciamento de slots de horários disponíveis.

**Funcionalidades:**
- Criação automática de horários baseada na agenda
- Marcação de horários ocupados
- Listagem de horários por agenda
- Sistema de busca por data e hora

### 6. **Scheduling (Agendamento)**

Gerenciamento de agendamentos de consultas.

**Funcionalidades:**
- Criação de agendamentos vinculando:
  - Profissional
  - Usuário
  - Horário específico
- Validação de datas e horários
- Suporte a múltiplos formatos de data

### 7. **Goal (Metas)**

Sistema de metas para usuários.

**Funcionalidades:**
- Criação de metas com título e descrição
- Execução de metas
- Atualização de metas
- Exclusão de metas
- Inativação automática de metas antigas
- Contador de execuções
- Listagem de metas por usuário

---

## 🔌 API Endpoints

### Person & Professional

#### `POST /persons/professional`
Cadastra um novo profissional.

**Body:**
```json
{
  "name": "Dr. Maria Silva",
  "birth_date": "1985-03-15",
  "cpf": "123.456.789-00",
  "address": "Rua das Flores",
  "neighborhood": "Centro",
  "number": 123,
  "complement": "Sala 201",
  "cep": "01234-567",
  "city": "São Paulo",
  "uf": "SP",
  "phone": "(11) 99999-8888",
  "email": "maria@example.com",
  "password": "senha123",
  "crp": "06/123456",
  "voluntary": false
}
```

**Response:** `201 Created`

---

#### `GET /professionals`
Lista todos os profissionais.

**Response:** `200 OK`
```json
{
  "professionals": [
    {
      "person_id": "uuid",
      "crp": "06/123456",
      "voluntary": false,
      "person": {
        "name": "Dr. Maria Silva",
        "email": "maria@example.com",
        ...
      }
    }
  ]
}
```

---

#### `GET /professionals/:professionalPersonId`
Busca um profissional por ID.

**Response:** `200 OK`

---

### User

#### `POST /persons/user`
Cadastra um novo usuário/paciente.

**Body:**
```json
{
  "name": "João Silva",
  "birth_date": "1990-05-20",
  "cpf": "987.654.321-00",
  "address": "Av. Brasil",
  "neighborhood": "Centro",
  "number": 456,
  "complement": "Apto 302",
  "cep": "54321-098",
  "city": "Rio de Janeiro",
  "uf": "RJ",
  "phone": "(21) 98888-7777",
  "email": "joao@example.com",
  "password": "senha456",
  "gender": "male"
}
```

**Response:** `201 Created`

---

### Schedule

#### `POST /schedules/:professionalPersonId`
Cria uma ou mais agendas para um profissional.

**Body:**
```json
[
  {
    "initialTime": "2024-12-01T09:00:00.000Z",
    "endTime": "2024-12-01T17:00:00.000Z",
    "interval": 60,
    "cancellationPolicy": 24,
    "averageValue": 150,
    "observation": "Atendimento presencial",
    "isControlled": true
  }
]
```

**Parâmetros:**
- `initialTime`: Data/hora inicial (UTC)
- `endTime`: Data/hora final (UTC)
- `interval`: Intervalo em minutos entre consultas
- `cancellationPolicy`: Política de cancelamento em horas
- `averageValue`: Valor médio da consulta
- `isControlled`: Se `true`, cria horários automaticamente

**Response:** `201 Created`

---

#### `GET /schedules/:professionalPersonId`
Lista todas as agendas de um profissional.

**Response:** `200 OK`

---

### Hourlies

#### `GET /hourlies/:scheduleId`
Lista todos os horários de uma agenda específica.

**Response:** `200 OK`
```json
{
  "hourlies": [
    {
      "id": "uuid",
      "scheduleId": "uuid",
      "date": "2024-12-01T09:00:00.000Z",
      "hour": "09:00",
      "isOcuped": false
    }
  ]
}
```

---

### Scheduling

#### `POST /schedulings`
Cria um agendamento de consulta.

**Body:**
```json
{
  "professionalPersonId": "uuid",
  "userPersonId": "uuid",
  "scheduleId": "uuid",
  "date": "2024-12-31",
  "hour": "10:00"
}
```

**Formatos de data aceitos:**
- ISO: `2024-12-31`
- Brasileiro: `31/12/2024`
- Americano: `12-31-2024`
- ISO completo: `2024-12-31T10:00:00.000Z`

**Response:** `201 Created`

---

### Goals

#### `POST /goals/:userPersonId`
Cria uma nova meta para um usuário.

**Body:**
```json
{
  "title": "Exercícios de respiração",
  "description": "Praticar 10 minutos de respiração profunda"
}
```

**Response:** `201 Created`

---

#### `GET /goals/:userPersonId`
Lista todas as metas de um usuário.

**Response:** `200 OK`

---

#### `PUT /goals/:goalId`
Atualiza uma meta.

**Body:**
```json
{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

**Response:** `200 OK`

---

#### `DELETE /goals/:goalId`
Exclui uma meta.

**Response:** `204 No Content`

---

#### `PATCH /goals/:goalId/execute`
Marca uma meta como executada.

**Response:** `200 OK`

---

#### `PATCH /goals/:goalId/counter`
Incrementa o contador de execuções de uma meta.

**Response:** `200 OK`

---

## ✅ Validação de Dados

### Sistema de Validação Inteligente de Data/Hora

A API possui um sistema robusto de validação de datas através da função `validateDateTime`:

**Formatos Aceitos:**

1. **ISO Simples**: `2024-12-31`
2. **Brasileiro**: `31/12/2024`
3. **Americano**: `12-31-2024`
4. **ISO Completo UTC**: `2024-12-31T10:00:00.000Z`
5. **ISO com Timezone**: `2024-12-31T10:00:00-03:00`
6. **Unix Timestamp**: `1735660800`

**Validações Realizadas:**

- ✅ Formato válido da data
- ✅ Data real (valida anos bissextos, dias por mês, etc.)
- ✅ Formato da hora (HH:mm ou HH:mm:ss)
- ✅ Hora válida (00:00 - 23:59)
- ✅ Normalização para UTC

**Exemplo de Uso:**

```typescript
const result = validateDateTime('31/12/2024', '10:30')
// {
//   isValid: true,
//   dateTimeString: '2024-12-31T10:30:00.000Z',
//   dateTimeObj: Date object,
//   error: undefined
// }
```

---

## 🧪 Testes

A aplicação possui cobertura completa de testes:

### Estrutura de Testes

```
src/
├── use-cases/          # Testes unitários (32 testes)
│   └── **/*.test.ts
└── http/controllers/   # Testes E2E (14 testes)
    └── **/*.test.ts
```

### Executar Testes

```bash
# Todos os testes unitários
pnpm test

# Testes em modo watch
pnpm test:watch

# Testes E2E
pnpm test:e2e

# Cobertura de código
pnpm test:coverage
```

### Tipos de Testes

**Unitários:**
- Testam casos de uso isoladamente
- Usam repositórios in-memory
- Não dependem de banco de dados

**E2E (End-to-End):**
- Testam toda a stack (HTTP → Use Case → Database)
- Usam banco de dados real (PostgreSQL)
- Testam integração completa

---

## 💾 Banco de Dados

### Tecnologia

- **PostgreSQL 14+**
- **Prisma ORM**

### Modelos Principais

#### Person
```prisma
model Person {
  id            String   @id @default(uuid())
  name          String
  birth_date    DateTime
  cpf           String
  address       String
  // ... mais campos
}
```

#### Professional
```prisma
model Professional {
  person_id String @id
  crp       String
  voluntary Boolean
}
```

#### Schedule
```prisma
model Schedule {
  id                    String   @id @default(uuid())
  professionalPersonId  String
  initialTime           DateTime
  endTime               DateTime
  interval              Int
  averageValue          Decimal
  cancellationPolicy    Int
  isControlled          Boolean
}
```

#### Hourly
```prisma
model Hourly {
  id         String   @id @default(uuid())
  scheduleId String
  date       DateTime
  hour       String
  isOcuped   Boolean
}
```

#### Scheduling
```prisma
model Scheduling {
  id                   String @id @default(uuid())
  hourlyId             String
  professionalPersonId String
  userPersonId         String
}
```

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco de dados (apenas desenvolvimento)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio
```

---

## 🌐 Timezone e Normalização

### Estratégia UTC

Toda a aplicação trabalha com **UTC (Coordinated Universal Time)** para evitar problemas de timezone:

1. **Entrada**: Aceita múltiplos formatos, normaliza para UTC
2. **Armazenamento**: Sempre salva em UTC no banco
3. **Processamento**: Toda lógica usa UTC
4. **Saída**: Retorna em UTC (frontend converte se necessário)

### Exemplo de Fluxo

```
Frontend (Brasil - UTC-3)
    ↓ Envia: "31/12/2024" + "10:00"
    
Validação (validateDateTime)
    ↓ Normaliza: "2024-12-31T10:00:00.000Z"
    
Backend (UTC)
    ↓ Processa: new Date("2024-12-31T10:00:00.000Z")
    
Banco de Dados (PostgreSQL)
    ↓ Armazena: 2024-12-31 10:00:00+00
```

---

## 🔐 Segurança

### Hashing de Senhas

- **bcryptjs** com salt rounds = 6
- Senhas nunca são armazenadas em texto plano
- Hash gerado automaticamente no cadastro

### Validação de Dados

- **Zod schemas** em todos os endpoints
- Validação de tipos, formatos e constraints
- Mensagens de erro descritivas

---

## 📚 Documentação da API

### Swagger UI

A API possui documentação interativa via Swagger:

```
http://localhost:3333/docs
```

Acesse para:
- Ver todos os endpoints
- Testar requisições
- Ver schemas de request/response
- Visualizar códigos de status

---

## 🤝 Contribuindo

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- **Biome** para linting e formatação
- **TypeScript strict mode** habilitado
- Seguir princípios SOLID
- Testes para novas funcionalidades

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Felipe Rocha**
- GitHub: [@feliperocha27vn](https://github.com/feliperocha27vn)

---

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato via email

---

**Desenvolvido com ❤️ para ajudar profissionais de saúde mental e seus pacientes**
