# Execução dos serviços

## Docker Compose

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend frontend admin
docker compose down
```

| Serviço | Porta host:container | Dependência e persistência |
|---|---:|---|
| `db` | 5432:5432 | PostgreSQL 16, healthcheck `pg_isready`, volume `postgres_data` |
| `backend` | 3001:3001 | espera o banco saudável; NestJS watch |
| `frontend` | 3000:3000 | Next.js dev; API em `localhost:3001` |
| `admin` | 5173:5173 | Vite; API em `localhost:3001` |

Os três serviços Node montam seus diretórios e executam `npm install` na inicialização. O backend monta `apps/ml` em `/usr/src/ml` somente leitura. O Dockerfile do backend cria `/opt/ml-venv` e instala numpy, pandas, scikit-learn, scipy e joblib. `apps/ml` não é serviço separado.

## Banco e migrations

`docker compose up` inicia o PostgreSQL, mas não aplica migrations. Depois que o banco estiver saudável, execute:

```bash
docker compose exec backend npx prisma migrate deploy
```

Para criar migrations em desenvolvimento, use Prisma dentro de `apps/backend` e versione os arquivos gerados. A URL dentro do Compose usa hostname `db`; com backend local fora do Compose, use `localhost`.

## Execução local + banco Docker

```bash
npm install
npm run db:up
npm run backend:dev
npm run frontend:dev
npm run admin:dev
```

Execute os três últimos comandos em terminais separados. `npm run dev` usa `concurrently` para iniciar os serviços locais e o banco.

## Endereços

- Site: http://localhost:3000
- Admin: http://localhost:5173/admin/home (login no site público em `/entrar`)
- API: http://localhost:3001
- Swagger UI: http://localhost:3001/api/docs
- PostgreSQL: `localhost:5432`

`NEXT_PUBLIC_API_URL` e `VITE_API_URL` são usadas pelo navegador e devem apontar a um endereço acessível pelo usuário, não ao hostname interno `backend`. `CORS_ORIGINS` lista origens separadas por vírgula. Credenciais padrão são somente para desenvolvimento.

## Notas técnicas

- API escuta em `0.0.0.0`, porta `PORT` (padrão 3001), valida DTOs globalmente e publica OpenAPI.
- PostgreSQL persiste no volume nomeado `postgres_data`.
- API chama ML por `python -m src.interference.cli`, com `ML_PYTHON_EXECUTABLE` e `ML_APP_PATH`; timeout de 30 segundos.
- Prisma usa `@prisma/adapter-pg` e `pg`. `apps/backend/package.json` também declara adapter/pacote MariaDB que o serviço atual não usa.
