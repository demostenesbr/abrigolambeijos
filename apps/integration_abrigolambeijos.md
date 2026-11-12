# Auditoria técnica — implementação e integrações

Atualizado por leitura da estrutura, Compose/Dockerfiles, controllers, DTOs, serviços, schema Prisma e consumidores UI. Registra implementação observada; nomes de arquivos não provam funcionalidade.

## A. Resumo executivo

1. Monorepo com site Next.js, Admin React/Vite, API NestJS/Prisma, PostgreSQL e pipeline Python ML.
2. Compose define `db`, `backend`, `frontend`, `admin`; ML é subprocesso da API, não um container/serviço HTTP separado.
3. Backend expõe CRUD de usuários, pets, adotantes, adoções, pedidos, resgates, doações, recomendações e parceiros, mais stats e Swagger `/api/docs`.
4. Frontend integra auth, perfil, stats, parceiros públicos, candidatura e recomendação; Admin integra CRUD e relatório do modelo. Nenhum frontend acessa DB diretamente.
5. JWT, bcrypt, validação de status e guards de papel estão implementados no backend. Auto cadastro cria somente `ADOPTER`.
6. Prisma define nove modelos, mas sem `@relation`/FK explícitas; IDs relacionados são escalares com índices.
7. Recomendação tem fluxo de UI a persistência: UI → API → CLI Python → score/ranking → tabela `Recommendations`.
8. Solicitação pública de adoção não fecha: `POST /adoption-requests` é admin-only.
9. Maior gap acadêmico: target ML sintético e atributos ML dos animais reais parcialmente inferidos; métricas não medem sucesso real de adoção.
10. Compose não executa migrations; inicialização limpa precisa de `prisma migrate deploy`.

## B. Mapa do projeto encontrado

```text
apps/
├── frontend/  # Next App Router; app/<rotas>, components, pages, services, hooks
├── admin/     # React/Vite; src/pages, components, hooks, routes, services,
│              # types, utils, layouts, contexts, workers
├── backend/   # Nest; src/modules, src/common; prisma/schema, migrations, seed
└── ml/        # datasets/{raw,processed,external}, notebooks,
               # src/{config,data,features,models,training,evaluation,interference},
               # models/animal-recommender, artfacts/reports
```

- Admin `src/pages`: dashboard, perfil, pets, adotantes, solicitações, adoções, resgates, doações, recomendações, modelo ML, parceiros. `src/services`: cliente API e serviços `pets`, `users`, `adopters`, `adoptions`, `adoption-requests`, `rescues`, `donations`, `partners`, `recommendation`, auth.
- Frontend App Router: `/`, `/animais`, `/adotar`, `/recomendacao`, `/perdidos`, `/resgastes`, `/parceiros`, `/doacoes`, `/sobre`, `/contato`, `/cadastro`, `/entrar`, `/perfil`, `/esqueci-senha`, `/redefinicao-senha`, `/politica-de-privacidade`, `/termos-de-uso`. Componentes de encontrados existem em `app/pages/found`, sem rota `/encontrados` encontrada.
- Backend `src/modules`: `auth`, `users`, `pets`, `adopters`, `adoptions`, `adoption-requests`, `rescues`, `donations`, `recommendations`, `partners`, `stats`, `ai`; `ai` não é importado pelo `AppModule`.
- Portas: frontend 3000, API 3001, admin 5173, PostgreSQL 5432. Volume Postgres: `postgres_data`.

## C. Escopo × implementação

Status: IMPLEMENTADO, PARCIAL, AUSENTE, INCONSISTENTE, NÃO FOI POSSÍVEL VERIFICAR.

| Área | Escopo esperado | Encontrado | Status | Evidência | Gap |
|---|---|---|---|---|---|
| Frontend | Next/React, páginas e integração API | Next 16 App Router; páginas públicas e serviços HTTP | PARCIAL | `apps/frontend/app`, `app/services` | UI perdido/resgate sem módulo equivalente na API; encontrados sem rota; pedido de adoção sem escrita pública |
| Admin | React/Vite e CRUD administrativo | Vite/React; páginas e serviços de domínios administráveis | IMPLEMENTADO | `apps/admin/src/pages`, `services`, `routes` | CRUD de usuários existe parcialmente no código, mas rota de gestão de usuários não está no router atual |
| Backend | REST, validação, regras, módulos | Nest 11, módulos registrados, DTO validation, CORS, Swagger | IMPLEMENTADO | `apps/backend/src/app.module.ts`, `main.ts` | `ai` não registrado; módulo lost/found não localizado |
| Prisma/DB | PostgreSQL e dados relacionais | PostgreSQL 16; Prisma adapter-pg; nove modelos | PARCIAL | `prisma/schema.prisma`, `PrismaService` | Sem `@relation`/FK; Compose não aplica migrations; deps MariaDB extras |
| Auth | JWT, RBAC, ativo/inativo | bcrypt, JWT, guards, papel/status reconsultados no banco | IMPLEMENTADO | auth service e guards | Sem refresh token; logout apenas local; telas reset sem API localizada |
| ML | preprocessing, treino, avaliação, inferência | pipeline Python e classificador chamado pela API | IMPLEMENTADO | `apps/ml/src`, `MlBridgeService` | Labels sintéticos e campos reais inferidos limitam validade externa |
| Dataset | pares compatibilidade e catálogo | CSV sintético, CSV real exportado e processado | PARCIAL | `apps/ml/README.md`, `datasets` | Target por heurística, poucos dados reais e atributos inferidos |
| Recommendation | perfil→score→ranking | `/recommendations/me` executa modelo e salva recomendações | IMPLEMENTADO | controller, DTO, service, bridge, UI | Perfil chega do browser a cada requisição, sem perfil estruturado salvo |
| LLM | complementar ao ML | nenhum provedor/chamada localizada; `ai.service.ts` não registrado | AUSENTE | AppModule e módulos | Não é integração existente |
| Integração | browser→API→DB; API→ML | fetch HTTP, Prisma pg, subprocess Python | IMPLEMENTADO | clientes frontend/admin, Prisma, bridge | pedido de adoção não completa fluxo |
| Docker | serviços locais integrados | db/backend/frontend/admin, healthcheck DB e volume | PARCIAL | Compose e Dockerfiles | migrations não automáticas; sem healthcheck app; defaults não adequados para produção |

## D. Integração e endpoints

### Matriz

| Origem | Destino | Tecnologia | Endpoint/interface | Arquivo | Estado |
|---|---|---|---|---|---|
| Frontend | Backend | fetch HTTP/JSON + Bearer | `/auth/*`, `/users/:id`, `/recommendations/me`, `/partners/public`, `/partners/applications`, `/stats`, `/donations/summary` | `frontend/app/services/{api,auth,stats}.ts` e páginas | FUNCIONAL nos fluxos listados |
| Admin | Backend | fetch HTTP/JSON + Bearer | `/stats/admin`, CRUD admin, `/recommendations/model/report` | `admin/src/services/api.ts`, services/pages | FUNCIONAL nos recursos conectados |
| Backend | PostgreSQL | Prisma 7 + adapter-pg + pg | `DATABASE_URL` | `backend/src/common/prisma/prisma.service.ts` | FUNCIONAL pela configuração |
| Backend | ML | subprocess local, JSON stdin/stdout | `python -m src.interference.cli` | `recommendations/ml-bridge.service.ts`, `apps/ml/src/interference/cli.py` | FUNCIONAL, timeout 30s |
| Backend | LLM | Não localizado | — | `modules/ai/ai.service.ts` não registrado | AUSENTE |

### Superfície REST

Base URL local `http://localhost:3001`; OpenAPI UI `/api/docs`. Acesso admin requer JWT Bearer válido, usuário ativo e papel `ADMIN`, salvo exceções públicas abaixo.

| Método/rota | Acesso e contrato principal |
|---|---|
| `GET /` | Público; resposta básica |
| `POST /auth/register` | Público; `email`, `password` (mín. 8), `name?`, `username?`; cria ADOPTER ativo |
| `POST /auth/login` | Público; `email`, `password`; token e usuário |
| `GET /auth/me` | JWT ativo |
| `/users` GET/POST/DELETE | Admin; lista/cria/exclui; GET/PATCH `:id` para próprio ou admin; só admin muda role/status |
| `/pets` CRUD | Admin |
| `/adopters` CRUD | Admin |
| `/adoptions` CRUD | Admin |
| `/adoption-requests` CRUD | Admin; não há POST público |
| `/rescues` CRUD | Admin |
| `/donations` CRUD | Admin; `GET /donations/summary` público e agregado |
| `/partners` CRUD | Admin; `GET /partners/public` e `POST /partners/applications` públicos |
| `GET /stats` | Público, agregado |
| `GET /stats/admin` | Admin |
| `/recommendations` CRUD | Admin |
| `POST /recommendations/generate` | Admin; `adopterId`, profile e `topN?` |
| `POST /recommendations/me` | Qualquer usuário ativo autenticado; profile e `topN?` 1–20 |
| `GET /recommendations/model/report` | Admin |

Perfil de recomendação: `home_type` Apartment/House; booleanos `has_yard`, `has_children`, `has_other_pets`; `children_age_group`; `other_pets_type` CAT/DOG/NONE; `dog_experience` Beginner/Intermediate/Experienced; `available_time` e `activity_level` Low/Medium/High; `preferred_size` Small/Medium/Large; `preferred_age` Filhote/Adulto/Idoso. `/me` retorna `{ adopterId, results: [{ petId, name, species, score }] }` e persiste `Recommendations`.

Candidatura de parceiro requer `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`; não cria conta. `PaginationQueryDto` oferece `page`, `limit` até 100 e `q`, mas não foi localizado nos controllers CRUD; listagens parecem não paginadas.

## E. Autenticação/RBAC

Backend é fonte de verdade. Cadastro sempre atribui `ADOPTER` e `ACTIVE`; papel elevado só por operação administrativa. Senha usa bcrypt. JWT contém `sub`; em cada requisição o guard valida token, recarrega usuário e bloqueia `INACTIVE`/`SUSPENDED`. `AdminOnly` exige ADMIN; `Public` abre endpoints explicitamente; `AnyAuthenticated` permite qualquer perfil autenticado (usado em `/recommendations/me`). `/users/:id` aplica self-or-admin e remove role/status do payload de não-admin.

Frontend persiste token em localStorage, limpa em 401 e expira sessão por inatividade local de 30 min. Não foi identificado refresh token ou logout server-side. Páginas de recuperação/redefinição existem, mas endpoints correspondentes não foram localizados.

## F. Machine Learning

Pipeline `apps/ml`: `src/data` (loader, cleaner, geração/exportação), `src/features` (transformação/encoding), `src/models` (Decision Tree, Random Forest, Logistic Regression, KNN), `src/training`, `src/evaluation`, `src/interference` (CLI, predictor, recommender), notebooks, CSVs e artefatos.

O conjunto de pares tem target `compatibility` sintético, calculado por regras. Modelos são comparados por F1 e validação cruzada agrupada por adotante, com baseline majoritário; relatórios têm accuracy, precision, recall, F1 e matriz de confusão. O modelo selecionado e metadados ficam em `models/animal-recommender/`; relatórios em `artfacts/reports/` (grafia literal usada no código). O processo lê pets do banco via payload do bridge e classifica/rankeia por score.

Limitação central: avaliação contra rótulos sintéticos mede reprodução de heurística e não eficácia de adoção real. Atributos dos pets reais que o formulário não coleta são inferidos por regras; recomendações refletem essas suposições.

## G. Schema e campos Prisma

Provider `postgresql`, `relationMode = "prisma"`; nenhum `@relation` explícito foi encontrado. IDs de vínculo não geram FK no schema.

| Modelo | Campos além do `id` |
|---|---|
| `Users` | `email` único, `name?`, `username?`, `password`, `role` (`ADOPTER/PROTECTOR/PARTNER/ADMIN`), `status` (`ACTIVE/INACTIVE/SUSPENDED`), timestamps |
| `Pets` | `animalname`, `rganimal`, `dateentry`, `petphoto?`, `name`, `race`, `gender`, `microchipped`, `microchipnumber?`, `castrated`, `coattypecoloration`, `predominantcoatcolor`, `signsanddistinctive`, `estimatedchronologicalage`, `birthdate`, `size`, `behavioralprofile?`, `healthcondition?`, `redemptioncondition?`, ML `species`, `energyLevel`, `temperament`, `sociability`, `exerciseNeed`, `apartmentAdaptability`, `childrenCompatibility`, `dogsCompatibility`, `catsCompatibility`, timestamps |
| `Adopters` | `name`, `email` único, `phone?`, timestamps |
| `Adoptions` | `adopterId`, `animalId`, `adoptionDate`, `status` (string, default `in_progress`), timestamps |
| `AdoptionRequests` | `adopterId`, `animalId`, `requestDate`, `petName`, `userName`, `email`, `phone`, `address`, `experience`, `home`, `status` (string, default `pending`), timestamps |
| `Rescues` | `name`, `location`, `status` (string: triage/in_treatment/recovered), timestamps |
| `Donations` | `donorName`, `amount` Float, `type`, `method`, `plan?`, `status`, timestamps |
| `Recommendations` | `adopterId`, `animalId`, `recommendationText`, timestamps |
| `Partners` | `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`, `location`, `status`, timestamps |

`animalId` é o nome usado nos vínculos, não `petId`. Status de adoções, pedidos, resgates, doações e parceiros são `String`, não enums Prisma. Campos opcionais/defaults e índices completos estão em `apps/backend/prisma/schema.prisma`.

## H. Gaps priorizados

| Prioridade | Problema | Evidência/impacto |
|---|---|---|
| CRÍTICO | Labels ML sintéticos | Não demonstram sucesso real; afetam conclusão acadêmica |
| ALTO | Pedido público de adoção sem escrita | `POST /adoption-requests` admin-only; fluxo de interesse não fecha |
| ALTO | Atributos reais inferidos | Scores usam dados não observados diretamente |
| ALTO | Sem relações/FKs Prisma | Possibilidade de órfãos e integridade dependente da aplicação |
| MÉDIO | Migrations manuais | Compose inicia banco vazio sem schema |
| MÉDIO | Reset de senha sem endpoints encontrados | Telas não comprovam fluxo backend |
| MÉDIO | `ai` não registrado | Nenhuma integração LLM atual |
| MÉDIO | Perdidos/encontrados ausentes na API | páginas não têm backend de domínio identificado |
| BAIXO | Dependências MariaDB no package backend | Código Prisma usa PostgreSQL; dependências aparentam obsoletas |
| BAIXO | Diretório `artfacts` | grafia inconsistente; scripts e relatório dependem do nome atual |

## I. Próximas ações recomendadas

| Ação | Arquivo/módulo | Dependência | Impacto | Prioridade |
|---|---|---|---|---|
| Projetar endpoint público seguro para pedido de adoção e conectar formulário | `adoption-requests` controller/DTO/service e frontend | definir identidade/vínculo do adotante | fecha fluxo de adoção | Alta |
| Coletar/rotular resultados com protocolo de especialistas ou outcomes anonimizados | datasets e gerador ML | consentimento e protocolo de dados | validade do TCC | Crítica |
| Identificar atributos comportamentais diretamente ou marcar incerteza | coleta real e `real_pets.py` | processo de avaliação animal | melhora rastreabilidade do score | Alta |
| Definir cardinalidades e adicionar relações/migrations, se regra de domínio confirmar | schema Prisma | revisão de domínio | integridade referencial | Alta |
| Tornar setup/migrations reproduzível e documentar healthcheck da API | Compose/runbook | estratégia dev/prod | instalações consistentes | Média |
| Implementar endpoints de recuperação ou adequar telas | auth frontend/backend | mecanismo seguro de email/token | fluxo de conta completo | Média |
| Remover dependências MariaDB após confirmação | backend package/lock | build e geração Prisma | coerência da stack | Baixa |

## J. Arquitetura e conclusão

```text
Browser
  ├── Next.js :3000 ── HTTP/JSON + JWT ──┐
  └── Admin Vite :5173 ─ HTTP/JSON + JWT ┤
                                         v
                               NestJS API :3001
                                 ├── Prisma adapter-pg ── PostgreSQL :5432
                                 └── subprocess Python ── apps/ml CLI

LLM: não integrado ao AppModule nem ao fluxo de recomendação encontrado.
```

**Com base exclusivamente no código encontrado, o projeto sustenta parte relevante, mas não todo o escopo definido.** Site, Admin, API, autenticação, persistência configurada, Docker e recomendação ponta a ponta existem no código. Faltam fluxo público de pedido de adoção, backend para perdidos/encontrados e validação empírica do ML em dados/outcomes reais. A existência de telas de senha não comprova recuperação funcional. Esta auditoria documenta configuração/código e não afirma que os containers estavam ativos no momento da leitura.
