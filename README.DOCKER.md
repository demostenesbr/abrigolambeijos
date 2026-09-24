# Execução Unificada dos Serviços

O PostgreSQL sempre roda via Docker. Os serviços Node (`backend`, `frontend`, `admin`) podem
rodar tanto via Docker Compose quanto localmente (CMD/terminal), desde que o banco esteja no ar.

## Opção A — Tudo via Docker Compose

```bash
docker compose up -d
```

Sobe `db`, `backend` (porta 3001), `frontend` (porta 3000) e `admin` (porta 5173).

```bash
docker compose down
```

## Opção B — Serviços locais (CMD) + banco no Docker

1. Copie `.env.example` para `.env` na raiz (e ajuste se necessário).
2. Suba somente o banco:
   ```bash
   npm run db:up
   ```
3. Instale as dependências dos workspaces (uma vez):
   ```bash
   npm install
   ```
4. Rode todos os serviços Node juntos, em um único terminal:
   ```bash
   npm run dev
   ```
   Ou individualmente:
   ```bash
   npm run backend:dev
   npm run frontend:dev
   npm run admin:dev
   ```

Se uma porta já estiver em uso (ex: `EADDRINUSE` na 3001), finalize o processo/CMD anterior
antes de rodar novamente — os scripts não sobem instâncias duplicadas.

## Machine Learning (`apps/ml`)

Não é um serviço HTTP. Continua sendo executado à parte, em um ambiente Python
(venv + `requirements.txt`), usado para notebooks, treinamento e geração de artefatos
consumidos futuramente pelo backend.

## Variáveis de ambiente relevantes

| Variável              | Onde é usada        | Observação                                             |
|-----------------------|----------------------|---------------------------------------------------------|
| `DATABASE_URL`        | backend             | Aponta para `db:5432` (Docker) ou `localhost:5432` (CMD) |
| `CORS_ORIGINS`        | backend             | Origens liberadas (frontend e admin)                    |
| `NEXT_PUBLIC_API_URL` | frontend            | Precisa ser acessível pelo navegador (`localhost`, não `backend`) |
| `VITE_API_URL`        | admin               | Idem, acessível pelo navegador                           |
