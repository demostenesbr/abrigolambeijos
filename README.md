# Abrigo Lambeijos

Monorepo de proteção animal com três aplicações web, API REST, PostgreSQL e pipeline Python de Machine Learning.

## Serviços e portas

| Serviço | Diretório | Tecnologia | Acesso local |
|---|---|---|---|
| Site público | `apps/frontend` | Next.js 16, React 19, TypeScript | http://localhost:3000 |
| Painel administrativo | `apps/admin` | React 19, Vite 8, TypeScript | http://localhost:5173/admin/home |
| API | `apps/backend` | NestJS 11, Prisma 7, PostgreSQL | http://localhost:3001; Swagger em `/api/docs` |
| Banco | serviço `db` | PostgreSQL 16 | `localhost:5432` |
| ML | `apps/ml` | Python, pandas, scikit-learn | CLI chamado pela API via subprocesso |

O Compose inicia `db`, `backend`, `frontend` e `admin`. ML não é container independente: o backend monta `apps/ml` e invoca o Python. Consulte [README.DOCKER.md](README.DOCKER.md) e [a auditoria de integração](apps/integration_abrigolambeijos.md).

## Estrutura

```text
apps/
├── admin/       # React/Vite: páginas, serviços HTTP, hooks, componentes
├── backend/     # NestJS: módulos REST, Prisma, migrations e seeds
├── frontend/    # Next App Router: páginas, serviços, componentes e hooks
└── ml/          # datasets, notebooks, src/data, features, models, training,
                 # evaluation, inference CLI e artefatos
```

## Executar

Requisitos: Docker Desktop/Compose e Node.js compatível com os Dockerfiles (Node 22). Para desenvolvimento local, instale dependências na raiz com `npm install`.

```bash
# Tudo em Docker
npm run docker:up
# Logs e encerramento
docker compose logs -f backend frontend admin
npm run docker:down

# Node local e banco no Docker
npm run db:up
npm run dev
```

O serviço `backend` aplica as migrations pendentes (`prisma migrate deploy`) antes de iniciar a API. Na execução local do Node, aplique-as manualmente conforme [README.DOCKER.md](README.DOCKER.md).

## Configuração

Configure `.env` a partir de `.env.example`: `DATABASE_URL`, `POSTGRES_*`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NEXT_PUBLIC_API_URL`, `VITE_API_URL`, `DB_POOL_MAX`. Integração Python também aceita `ML_APP_PATH` e `ML_PYTHON_EXECUTABLE`. URLs `NEXT_PUBLIC_API_URL` e `VITE_API_URL` precisam ser acessíveis pelo navegador (padrão `http://localhost:3001`).
