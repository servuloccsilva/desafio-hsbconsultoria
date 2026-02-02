# 🏢 Sistema de Cadastro de Empresas com Filas

Sistema completo para cadastro de empresas e processamento assíncrono usando filas.

Desenvolvido como desafio técnico, contemplando backend, frontend, filas assíncronas e persistência em nuvem.

---

## 🚀 Tecnologias

### Backend

- Node.js + TypeScript
- Express.js 4.x
- Firebase Firestore (banco de dados)
- Redis + BullMQ (filas assíncronas)
- Docker (containerização do Redis)

### Frontend

- React 18 + TypeScript
- React Router (navegação)
- Axios (requisições HTTP)

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** versão **18.x ou 20.x** (LTS recomendada)
  - Verifique: `node --version`
  - Download: https://nodejs.org/

- **Docker Desktop** (para rodar Redis)
  - Verifique: `docker --version`
  - Download: https://www.docker.com/products/docker-desktop

- **Git**
  - Verifique: `git --version`

- **Conta Google** (para criar projeto Firebase - gratuita)

---

## ⚙️ Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/desafio-empresas.git
cd desafio-empresas
```

---

### 2️⃣ Configure o Firebase

#### Passo a passo:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `desafio-empresas` (ou qualquer nome)
4. **Desative** Google Analytics (não é necessário)
5. Clique em **"Criar projeto"**

#### Ativar Firestore:

1. No menu lateral → **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Modo: **"Iniciar no modo de produção"**
4. Localização: **"us-central"** (ou mais próxima)
5. Clique em **"Ativar"**

#### Baixar credenciais:

1. Menu lateral → ⚙️ **"Configurações do projeto"**
2. Aba **"Contas de serviço"**
3. Clique em **"Gerar nova chave privada"**
4. Confirme clicando em **"Gerar chave"**
5. Um arquivo JSON será baixado

#### Adicionar credenciais ao projeto:

```bash
# Renomeie o arquivo baixado para:
serviceAccountKey.json

# Mova para a pasta backend:
mv ~/Downloads/serviceAccountKey.json backend/
```

**IMPORTANTE:** O arquivo `serviceAccountKey.json` contém credenciais sensíveis e **NÃO** deve ser commitado no Git (já está no `.gitignore`).

---

### 3️⃣ Configure as variáveis de ambiente

#### Backend

Crie o arquivo `backend/.env`:

```env
PORT=3001
NODE_ENV=development

# Firebase (substitua pelo ID do seu projeto)
FIREBASE_PROJECT_ID=desafio-empresas

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
FRONTEND_URL=http://localhost:3000
```

**Como encontrar o FIREBASE_PROJECT_ID:**

- No Firebase Console → Configurações do projeto → ID do projeto

#### Frontend

Crie o arquivo `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

### 4️⃣ Suba o Redis com Docker

```bash
# Certifique-se de estar na raiz do projeto
docker-compose up -d
```

**Verificar se está rodando:**

```bash
docker ps
```

Deve aparecer: `desafio-empresas-redis`

---

### 5️⃣ Instale as dependências

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

---

## 🎯 Como Executar

### Iniciar o Backend

```bash
cd backend
npm run dev
```

**Saída esperada:**

```
=================================
🚀 Servidor rodando na porta 3001
📍 http://localhost:3001
📍 Health check: http://localhost:3001/health
📍 API: http://localhost:3001/api
=================================
✅ Firebase configurado com sucesso!
✅ Redis conectado com sucesso!
```

### Iniciar o Frontend (em outro terminal)

```bash
cd frontend
npm start
```

O navegador abrirá automaticamente em: **http://localhost:3000**

---

## 📚 API Endpoints

### Empresas

| Método | Endpoint            | Descrição                |
| ------ | ------------------- | ------------------------ |
| POST   | `/api/empresas`     | Criar empresa            |
| GET    | `/api/empresas`     | Listar todas as empresas |
| GET    | `/api/empresas/:id` | Buscar empresa por ID    |
| PUT    | `/api/empresas/:id` | Atualizar empresa        |
| DELETE | `/api/empresas/:id` | Deletar empresa          |

### Filas

| Método | Endpoint                                | Descrição                                     |
| ------ | --------------------------------------- | --------------------------------------------- |
| POST   | `/api/empresas/:id/jobs`                | Adicionar job na fila                         |
| GET    | `/api/empresas/:id/jobs?status=waiting` | Listar jobs (waiting/active/completed/failed) |
| GET    | `/api/empresas/:id/queue-status`        | Obter status da fila                          |

---

## 🧪 Exemplos de Uso

### Health Check

```bash
curl http://localhost:3001/health
```

### Criar Empresa

```bash
curl -X POST http://localhost:3001/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "razaoSocial": "Tech Solutions LTDA",
    "cnpj": "11.222.333/0001-81",
    "dataInicio": "2024-01-01T00:00:00.000Z",
    "dataFim": "2025-12-31T23:59:59.000Z"
  }'
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "razaoSocial": "Tech Solutions LTDA",
    "cnpj": "11222333000181",
    "dataInicio": "2024-01-01T00:00:00.000Z",
    "dataFim": "2025-12-31T23:59:59.000Z",
    "createdAt": "2026-02-03T...",
    "updatedAt": "2026-02-03T..."
  },
  "message": "Empresa criada com sucesso!"
}
```

### Listar Empresas

```bash
curl http://localhost:3001/api/empresas
```

### Adicionar Job na Fila

```bash
# Substitua EMPRESA_ID pelo ID retornado ao criar empresa
curl -X POST http://localhost:3001/api/empresas/EMPRESA_ID/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "enviar-email",
    "dados": {
      "destinatario": "contato@empresa.com",
      "assunto": "Bem-vindo!"
    }
  }'
```

**No terminal do backend você verá:**

```
✅ Job adicionado na fila da empresa Tech Solutions LTDA: 1
🔄 Processando job 1 da empresa Tech Solutions LTDA
📧 Enviando email para empresa Tech Solutions LTDA
✅ Job 1 processado com sucesso!
```

---

## 📂 Estrutura do Projeto

```
desafio-empresas/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (Firebase, Redis, Express)
│   │   ├── controllers/     # Controladores (recebem requisições HTTP)
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição de rotas da API
│   │   ├── queues/          # Gerenciamento de filas BullMQ
│   │   ├── types/           # Tipos TypeScript (interfaces)
│   │   ├── utils/           # Funções utilitárias (validações, formatações)
│   │   └── server.ts        # Arquivo principal
│   ├── .env                 # Variáveis de ambiente (NÃO commitado)
│   ├── serviceAccountKey.json  # Credenciais Firebase (NÃO commitado)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React reutilizáveis
│   │   ├── pages/           # Páginas (Home, DetalheEmpresa)
│   │   ├── services/        # Services de API (Axios)
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilitários (validações, formatações)
│   │   └── App.tsx          # Componente raiz
│   ├── .env                 # Variáveis de ambiente (NÃO commitado)
│   └── package.json
│
├── docker-compose.yml       # Configuração do Redis
└── README.md
```

---

## 🎨 Funcionalidades Implementadas

### Backend

- ✅ CRUD completo de empresas
- ✅ Validação de CNPJ com algoritmo oficial
- ✅ Validação de datas e períodos
- ✅ Persistência no Firebase Firestore
- ✅ Criação automática de fila para cada empresa
- ✅ Workers BullMQ para processamento assíncrono
- ✅ Retry automático (3 tentativas) em caso de falha
- ✅ Tipos de jobs: enviar-email, gerar-relatório, sincronizar-dados, etc
- ✅ Endpoints para gerenciar filas

### Frontend

- ✅ Interface React responsiva
- ✅ Cadastro de empresas com validações em tempo real
- ✅ Listagem de empresas com cards
- ✅ Página de detalhes com informações completas
- ✅ Formulário para adicionar jobs com campos dinâmicos
- ✅ Status da fila em tempo real (atualização automática)
- ✅ Máscara de CNPJ automática
- ✅ Feedback visual (mensagens de erro/sucesso)

---

## 🐛 Troubleshooting

### Problema: "Firebase conectado com sucesso" não aparece

**Solução:**

1. Verifique se o arquivo `backend/serviceAccountKey.json` existe
2. Verifique se o `FIREBASE_PROJECT_ID` no `.env` está correto
3. Rode: `cd backend && npm install firebase-admin`

---

### Problema: "Redis conectado com sucesso" não aparece

**Solução:**

1. Verifique se Docker Desktop está rodando
2. Rode: `docker-compose up -d`
3. Verifique: `docker ps` (deve aparecer container Redis)
4. Se não aparecer: `docker-compose down && docker-compose up -d`

---

### Problema: Erro "path-to-regexp"

**Solução:**

```bash
cd backend
npm uninstall express
npm install express@4.21.2 --save-exact
npm install path-to-regexp@0.1.7 --save-exact
```

---

### Problema: Frontend não conecta com backend (CORS)

**Solução:**

1. Verifique se backend está rodando na porta 3001
2. Verifique se `frontend/.env` tem `REACT_APP_API_URL=http://localhost:3001/api`
3. Reinicie o frontend: `npm start`

---

### Problema: "Fila não encontrada" ao ver detalhes

**Solução:**

- Este comportamento é esperado se a empresa foi criada antes de reiniciar o backend
- Ao adicionar o primeiro job, a fila será recriada automaticamente
- Os jobs anteriores continuam no Redis e aparecem corretamente

---

## 🧪 Testando o Fluxo Completo

### 1. Criar uma empresa via interface:

- Acesse http://localhost:3000
- Preencha o formulário
- Clique em "Cadastrar Empresa"
- Empresa aparece na lista abaixo

### 2. Ver detalhes e adicionar job:

- Clique em "Ver Detalhes / Fila"
- Veja informações da empresa
- Status da fila mostra: 0/0/0/0
- Selecione tipo de job (ex: "Enviar Email")
- Preencha destinatário e assunto
- Clique "Adicionar Job"

### 3. Observar processamento:

- No terminal do backend, veja logs de processamento
- Status da fila atualiza automaticamente:
  - Aguardando: 1 (temporário)
  - Em Processamento: 1 (temporário)
  - Concluídos: 1 (após ~2 segundos)

---

## 📝 Decisões Técnicas

### Por que Firebase Firestore?

- Especificado no desafio técnico
- Fácil configuração
- Escalável automaticamente
- Gratuito para desenvolvimento

### Por que Redis + BullMQ?

- Especificado no desafio técnico
- Redis é extremamente rápido (in-memory)
- BullMQ oferece retry automático, prioridades, delayed jobs
- Excelente para processamento assíncrono

### Por que TypeScript?

- Type safety (menos bugs)
- Melhor IntelliSense
- Refatoração mais segura
- Documentação viva (tipos servem como docs)

### Por que separar Controllers e Services?

- Controllers: lidam com HTTP
- Services: contêm lógica de negócio
- Testabilidade (posso testar services isoladamente)
- Reutilização (services podem ser usados em CLI, cron jobs, etc)

---

## 📝 Licença

MIT

---

## 👨‍💻 Autor

**Sérvulo Silva**

Desenvolvido como desafio técnico para processo seletivo.

---
