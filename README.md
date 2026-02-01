# Desafio Técnico - Sistema de Cadastro de Empresas

## Descrição

Sistema completo para cadastro de empresas com processamento assíncrono usando filas.

## Tecnologias

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** React + TypeScript
- **Banco de Dados:** Firebase Firestore
- **Filas:** Redis + BullMQ
- **Containerização:** Docker

## Estrutura do Projeto

```
desafio-empresas/
├── backend/          # API REST
├── frontend/         # Interface React
└── docker-compose.yml
```

## Como Executar

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- Conta Firebase

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Redis (Docker)

```bash
docker-compose up -d
```

## Autor

[Seu Nome]

## Licença

MIT
