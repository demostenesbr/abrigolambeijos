# Backend — API Abrigo Lambeijos

API REST NestJS 11 + TypeScript, Prisma 7 e PostgreSQL 16. Raiz `/`; Swagger/OpenAPI em `/api/docs`. A validação global rejeita propriedades fora dos DTOs (`whitelist`, `forbidNonWhitelisted`) e converte tipos. CORS vem de `CORS_ORIGINS`.

## Módulos e estrutura

`src/modules/`: `auth`, `users`, `pets`, `adopters`, `adoptions`, `adoption-requests`, `rescues`, `donations`, `recommendations`, `partners`, `stats` e `ai`. `src/common/`: Prisma, JWT, guards, decorators, DTO de paginação e filtro de erros Prisma. `prisma/`: schema, migrations, configuração, seeds e importador de pets reais.

O módulo `ai` está no disco, mas não consta do `AppModule`; nenhuma integração LLM foi encontrada. Prisma conecta via `PrismaPg` (`@prisma/adapter-pg`) e pool `pg`.

## Endpoints

Todos usam JSON. Recursos marcados admin exigem JWT Bearer, usuário `ACTIVE` e papel `ADMIN`.

| Método | Rota | Acesso/uso |
|---|---|---|
| GET | `/` | Público; verificação básica |
| POST | `/auth/register` | Público; registra adotante |
| POST | `/auth/login` | Público; retorna access token |
| GET | `/auth/me` | JWT ativo |
| GET, POST | `/users` | Admin; listar/criar |
| GET, PATCH | `/users/:id` | Próprio usuário ou admin; só admin altera papel/status |
| DELETE | `/users/:id` | Admin |
| GET, POST | `/pets` | Admin; listar/criar |
| GET, PATCH, DELETE | `/pets/:id` | Admin |
| GET, POST | `/adopters` | Admin; listar/criar |
| GET, PATCH, DELETE | `/adopters/:id` | Admin |
| GET, POST | `/adoptions` | Admin; listar/criar |
| GET, PATCH, DELETE | `/adoptions/:id` | Admin |
| GET, POST | `/adoption-requests` | Admin; listar/criar |
| GET, PATCH, DELETE | `/adoption-requests/:id` | Admin |
| GET, POST | `/rescues` | Admin; listar/criar |
| GET, PATCH, DELETE | `/rescues/:id` | Admin |
| GET, POST | `/donations` | Admin; listar/criar |
| GET, PATCH, DELETE | `/donations/:id` | Admin |
| GET | `/donations/summary` | Público; resumo anônimo agregado |
| GET, POST | `/partners` | Admin; listar/criar |
| GET, PATCH, DELETE | `/partners/:id` | Admin |
| POST | `/partners/applications` | Público; enviar candidatura de parceiro |
| GET | `/partners/public` | Público; parceiros ativos |
| GET | `/stats` | Público; estatísticas agregadas |
| GET | `/stats/admin` | Admin; indicadores do painel |
| POST | `/recommendations/me` | Qualquer JWT ativo; ranking do próprio usuário |
| POST | `/recommendations/generate` | Admin; ranking por `adopterId` |
| GET, POST | `/recommendations` | Admin; listar/criar registros |
| GET | `/recommendations/model/report` | Admin; relatório do modelo/datasets |
| GET, PATCH, DELETE | `/recommendations/:id` | Admin |

**Gap do fluxo de adoção:** `POST /adoption-requests` é protegido para admin; não há endpoint público de escrita no controller encontrado.

### DTOs e contratos notáveis

- `POST /auth/register`: `{ email, password, name?, username? }`; senha mínima 8. Autocadastro sempre cria `ADOPTER` ativo. Bcrypt para hash; JWT assinado com `JWT_SECRET`.
- `POST /auth/login`: `{ email, password }`; usuário não ativo é recusado.
- `POST /recommendations/me`: `{ profile, topN? }`; `topN` inteiro 1–20. `profile` contém `home_type` (`Apartment|House`), `has_yard`, `has_children`, `children_age_group`, `has_other_pets`, `other_pets_type` (`CAT|DOG|NONE`), `dog_experience` (`Beginner|Intermediate|Experienced`), `available_time`, `activity_level` (`Low|Medium|High`), `preferred_size` (`Small|Medium|Large`) e `preferred_age` (`Filhote|Adulto|Idoso`). Resposta `{ adopterId, results: [{ petId, name, species, score }] }`; persiste os resultados.
- `POST /partners/applications`: `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`; candidatura não cria conta.
- `PaginationQueryDto` define `page`, `limit` (máx. 100), `q`, mas não foi localizado nos controllers CRUD; listagens atuais parecem não paginadas.

## Schema Prisma

Datasource PostgreSQL, `relationMode = "prisma"`. Não há `@relation` declarado: os campos ID abaixo não criam chaves estrangeiras explícitas no schema.

| Modelo | Campos além do `id` |
|---|---|
| `Users` | `email` único, `name?`, `username?`, `password`, `role` (`ADOPTER/PROTECTOR/PARTNER/ADMIN`), `status` (`ACTIVE/INACTIVE/SUSPENDED`), `createdAt`, `updatedAt` |
| `Pets` | `animalname`, `rganimal`, `dateentry`, `petphoto?`, `name`, `race`, `gender`, `microchipped`, `microchipnumber?`, `castrated`, `coattypecoloration`, `predominantcoatcolor`, `signsanddistinctive`, `estimatedchronologicalage`, `birthdate`, `size`, `behavioralprofile?`, `healthcondition?`, `redemptioncondition?`, `species`, `energyLevel`, `temperament`, `sociability`, `exerciseNeed`, `apartmentAdaptability`, `childrenCompatibility`, `dogsCompatibility`, `catsCompatibility`, timestamps |
| `Adopters` | `name`, `email` único, `phone?`, timestamps |
| `Adoptions` | `adopterId`, `animalId`, `adoptionDate`, `status` (`String`, padrão `in_progress`), timestamps |
| `AdoptionRequests` | `adopterId`, `animalId`, `requestDate`, `petName`, `userName`, `email`, `phone`, `address`, `experience`, `home`, `status` (`String`, padrão `pending`), timestamps |
| `Rescues` | `name`, `location`, `status` (`String`: triage/in_treatment/recovered), timestamps |
| `Donations` | `donorName`, `amount` (Float), `type`, `method`, `plan?`, `status`, timestamps |
| `Recommendations` | `adopterId`, `animalId`, `recommendationText`, timestamps |
| `Partners` | `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`, `location`, `status`, timestamps |

Os campos `animalId` não se chamam `petId`; vários status são strings em vez de enums Prisma. Ver `prisma/schema.prisma` para defaults/índices completos.

## Integração ML

`RecommendationsService` lê pets do banco e mapeia para Python: `id`, `name`, `species`, `age`, `energy_level`, `temperament`, `sociability`, `exercise_need`, `apartment_adaptability`, `children_compatibility`, `dogs_compatibility`, `cats_compatibility`. `MlBridgeService` executa `python -m src.interference.cli` em subprocesso; JSON via stdin/stdout; timeout 30s.

Por padrão `ML_APP_PATH` resolve para `../ml` relativo ao processo e o executável é `apps/ml/.venv/Scripts/python.exe` no Windows ou `.venv/bin/python` em POSIX. Docker usa `/usr/src/ml` e `/opt/ml-venv/bin/python`.

## Comandos e ambiente

```bash
npm run start:dev
npm run build
npx prisma migrate deploy
```

Variáveis: `DATABASE_URL`, `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_POOL_MAX`, `ML_APP_PATH`, `ML_PYTHON_EXECUTABLE`. Compose não aplica migrations automaticamente. O pacote declara adapter/pacote MariaDB junto ao adapter PostgreSQL usado pelo código; MariaDB parece dependência obsoleta.
