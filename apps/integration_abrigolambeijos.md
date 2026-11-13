# Auditoria técnica — implementação e integrações

Atualizado por leitura da estrutura, Compose/Dockerfiles, controllers, DTOs, serviços, schema Prisma e consumidores UI. Registra implementação observada; nomes de arquivos não provam funcionalidade.

## A. Resumo executivo

1. Monorepo com site Next.js, Admin React/Vite, API NestJS/Prisma, PostgreSQL e pipeline Python ML.
2. Compose define `db`, `backend`, `frontend`, `admin`; ML é subprocesso da API, não um container/serviço HTTP separado.
3. Backend expõe CRUD de usuários, pets, adotantes, adoções, pedidos, resgates, doações, recomendações e parceiros, mais stats e Swagger `/api/docs`.
4. Frontend integra auth, perfil, stats, parceiros públicos, candidatura e recomendação; Admin integra CRUD e relatório do modelo. Nenhum frontend acessa DB diretamente.
5. JWT, bcrypt, validação de status e guards de papel estão implementados no backend. Auto cadastro cria somente `ADOPTER`.
6. Prisma declara relações entre contas, perfis de adotante, pets, adoções, solicitações e recomendações, com FKs PostgreSQL. A migration faz preflight de órfãos/duplicidades.
7. Recomendação tem fluxo de UI a persistência: UI → API → CLI Python → score/ranking → tabela `Recommendations`.
8. Adotantes autenticados criam solicitações próprias por `POST /adoption-requests/me`; o Admin mantém a decisão por PATCH.
9. Maior gap acadêmico: target ML sintético e atributos ML dos animais reais parcialmente inferidos; métricas não medem sucesso real de adoção.
10. O Compose aplica migrations pendentes antes de subir a API; execução local fora do Compose exige deploy manual.

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
| Frontend | Next/React, páginas e integração API | Next 16 App Router; páginas públicas, solicitação de adoção e serviços HTTP | PARCIAL | `apps/frontend/app`, `app/services` | Perdidos/resgates sem módulo equivalente na API; encontrados sem rota |
| Admin | React/Vite e CRUD administrativo | Vite/React; páginas e serviços de domínios administráveis | IMPLEMENTADO | `apps/admin/src/pages`, `services`, `routes` | CRUD de usuários existe parcialmente no código, mas rota de gestão de usuários não está no router atual |
| Backend | REST, validação, regras, módulos | Nest 11, módulos registrados, DTO validation, CORS, Swagger | IMPLEMENTADO | `apps/backend/src/app.module.ts`, `main.ts` | `ai` não registrado; módulo lost/found não localizado |
| Prisma/DB | PostgreSQL e dados relacionais | PostgreSQL 16; Prisma adapter-pg; nove modelos com relações explícitas | IMPLEMENTADO | schema, migration `20261112090000_add_explicit_relations`, `PrismaService` | Migration aborta se houver órfãos ou RGA duplicado; deps MariaDB extras |
| Auth | JWT, RBAC, ativo/inativo | bcrypt, JWT, guards, papel/status reconsultados no banco | IMPLEMENTADO | auth service e guards | Sem refresh token; logout apenas local; telas reset sem API localizada |
| ML | preprocessing, treino, avaliação, inferência | pipeline Python e classificador chamado pela API | IMPLEMENTADO | `apps/ml/src`, `MlBridgeService` | Labels sintéticos e campos reais inferidos limitam validade externa |
| Dataset | pares compatibilidade e catálogo | CSV sintético, CSV real exportado e processado | PARCIAL | `apps/ml/README.md`, `datasets` | Target por heurística, poucos dados reais e atributos inferidos |
| Recommendation | perfil→score→ranking | `/recommendations/me` executa modelo e salva recomendações | IMPLEMENTADO | controller, DTO, service, bridge, UI | Perfil chega do browser a cada requisição, sem perfil estruturado salvo |
| LLM | complementar ao ML | nenhum provedor/chamada localizada; `ai.service.ts` não registrado | AUSENTE | AppModule e módulos | Não é integração existente |
| Integração | browser→API→DB; API→ML | fetch HTTP, Prisma pg, subprocess Python | IMPLEMENTADO | clientes frontend/admin, Prisma, bridge | Fluxo de adoção conectado; perdidos/resgates seguem sem API de domínio |
| Docker | serviços locais integrados | db/backend/frontend/admin, healthcheck DB e volume; backend migra antes de iniciar | PARCIAL | Compose e Dockerfiles | Sem healthcheck próprio da API; defaults não adequados para produção |

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
| `/adoption-requests` CRUD | Admin; POST administrativo para cadastro manual |
| `POST /adoption-requests/me` | Perfil `ADOPTER` ativo; cria solicitação própria, sempre `pending` |
| `/rescues` CRUD | Admin |
| `/donations` CRUD | Admin; `GET /donations/summary` público e agregado |
| `/partners` CRUD | Admin; `GET /partners/public` e `POST /partners/applications` públicos |
| `GET /stats` | Público, agregado |
| `GET /stats/admin` | Admin |
| `/recommendations` CRUD | Admin |
| `POST /recommendations/generate` | Admin; `adopterId`, profile e `topN?` |
| `POST /recommendations/me` | Qualquer usuário ativo autenticado; profile e `topN?` 1–20 |
| `GET /recommendations/model/report` | Admin |

A solicitação de adoção no site exige conta ativa com papel `ADOPTER`; o formulário envia `{ animalReference, phone, address, experience, home }`. O servidor extrai identidade do JWT, associa/cria o perfil e grava `pending`. No Admin, `PATCH /adoption-requests/:id` permite `pending`, `approved` ou `rejected`. A chave do card é resolvida por `Pets.rganimal`, nunca por um ID controlado pelo browser.

Perfil de recomendação: `home_type` Apartment/House; booleanos `has_yard`, `has_children`, `has_other_pets`; `children_age_group`; `other_pets_type` CAT/DOG/NONE; `dog_experience` Beginner/Intermediate/Experienced; `available_time` e `activity_level` Low/Medium/High; `preferred_size` Small/Medium/Large; `preferred_age` Filhote/Adulto/Idoso. `/me` retorna `{ adopterId, results: [{ petId, name, species, score }] }` e persiste `Recommendations`.

Candidatura de parceiro requer `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`; não cria conta. `GET /pets` usa `PaginationQueryDto`: `page`, `limit` até 100 e `q`; sem `page`, preserva a resposta array; paginado, retorna itens, total, páginas e resumo. Outras listagens não mostram paginação uniforme.

## E. Autenticação/RBAC

Backend é fonte de verdade. Cadastro sempre atribui `ADOPTER` e `ACTIVE`; papel elevado só por operação administrativa. Senha usa bcrypt. JWT contém `sub`; em cada requisição o guard valida token, recarrega usuário e bloqueia `INACTIVE`/`SUSPENDED`. `AdminOnly` exige ADMIN; `Public` abre endpoints explicitamente; `AnyAuthenticated` permite qualquer perfil autenticado (usado em `/recommendations/me`). `POST /adoption-requests/me` substitui o role metadata do controller para exigir especificamente `ADOPTER`; os endpoints de listagem e decisão seguem ADMIN-only. `/users/:id` aplica self-or-admin e remove role/status do payload de não-admin.

Frontend persiste token em localStorage, limpa em 401 e expira sessão por inatividade local de 30 min. Não foi identificado refresh token ou logout server-side. Páginas de recuperação/redefinição existem, mas endpoints correspondentes não foram localizados.

## F. Machine Learning

Pipeline `apps/ml`: `src/data` (loader, cleaner, geração/exportação), `src/features` (transformação/encoding), `src/models` (Decision Tree, Random Forest, Logistic Regression, KNN), `src/training`, `src/evaluation`, `src/interference` (CLI, predictor, recommender), notebooks, CSVs e artefatos.

O conjunto de pares tem target `compatibility` sintético, calculado por regras. Modelos são comparados por F1 e validação cruzada agrupada por adotante, com baseline majoritário; relatórios têm accuracy, precision, recall, F1 e matriz de confusão. O modelo selecionado e metadados ficam em `models/animal-recommender/`; relatórios em `artfacts/reports/` (grafia literal usada no código). O processo lê pets do banco via payload do bridge e classifica/rankeia por score. O painel e a página de recomendação identificam os scores/métricas como experimentais e esclarecem que não medem adoções bem-sucedidas. Remover essa limitação exige rótulos reais ou independentes; não há correção válida por código ou por fabricar labels.

Limitação central: avaliação contra rótulos sintéticos mede reprodução de heurística e não eficácia de adoção real. Atributos dos pets reais que o formulário não coleta são inferidos por regras; recomendações refletem essas suposições.

## G. Schema e campos Prisma

Provider `postgresql`, `relationMode = "foreignKeys"`. `Users` ↔ `Adopters` é 1:1 opcional; `Adopters` ↔ `Adoptions`, `AdoptionRequests`, `Recommendations` é 1:N; `Pets` ↔ esses modelos é 1:N. Excluir conta desvincula perfil (`SetNull`); exclusão de pet/adotante com histórico é bloqueada (`Restrict`). `Pets.rganimal` é único. A migration verifica órfãos e duplicidades antes de alterar o schema.

| Modelo | Campos além do `id` |
|---|---|
| `Users` | `email` único, `name?`, `username?`, `password`, `role` (`ADOPTER/PROTECTOR/PARTNER/ADMIN`), `status` (`ACTIVE/INACTIVE/SUSPENDED`), timestamps |
| `Pets` | `animalname`, `rganimal`, `dateentry`, `petphoto?`, `name`, `race`, `gender`, `microchipped`, `microchipnumber?`, `castrated`, `coattypecoloration`, `predominantcoatcolor`, `signsanddistinctive`, `estimatedchronologicalage`, `birthdate`, `size`, `behavioralprofile?`, `healthcondition?`, `redemptioncondition?`, ML `species`, `energyLevel`, `temperament`, `sociability`, `exerciseNeed`, `apartmentAdaptability`, `childrenCompatibility`, `dogsCompatibility`, `catsCompatibility`, timestamps |
| `Adopters` | `name`, `email` único, `userId?` único, `phone?`, timestamps |
| `Adoptions` | `adopterId`, `animalId`, `adoptionDate`, `status` (string, default `in_progress`), timestamps |
| `AdoptionRequests` | `adopterId`, `animalId`, `requestDate`, `petName`, `userName`, `email`, `phone`, `address`, `experience`, `home`, `status` (string, default `pending`), timestamps |
| `Rescues` | `name`, `location`, `status` (string: triage/in_treatment/recovered), timestamps |
| `Donations` | `donorName`, `amount` Float, `type`, `method`, `plan?`, `status`, timestamps |
| `Recommendations` | `adopterId`, `animalId`, `recommendationText`, timestamps |
| `Partners` | `name`, `type`, `contact`, `email`, `phone`, `address`, `city`, `state`, `country`, `description`, `location`, `status`, timestamps |

`animalId` é o nome usado nos vínculos, não `petId`. Status de adoções, pedidos, resgates, doações e parceiros são `String`, não enums Prisma. Campos opcionais/defaults e índices completos estão em `apps/backend/prisma/schema.prisma`.

## H. Gaps priorizados

| Prioridade | Problema remanescente | Evidência/impacto |
|---|---|---|
| CRÍTICO | Labels ML sintéticos | Métricas medem reprodução de regra, não adoções reais; demanda coleta ética e avaliação independente. |
| ALTO | Atributos reais inferidos | Scores usam características que não foram observadas diretamente. |
| MÉDIO | Reset de senha sem endpoints encontrados | As telas não comprovam recuperação pelo backend. |
| MÉDIO | Módulo `ai` não registrado | Nenhuma integração LLM ativa foi localizada. |
| MÉDIO | Perdidos/encontrados sem API de domínio | As páginas não persistem esses fluxos no backend atual. |
| BAIXO | Dependências MariaDB no package backend | Código Prisma usa PostgreSQL; dependências aparentam obsoletas. |
| BAIXO | Diretório `artfacts` | Grafia fora do padrão, referenciada pelo código e artefatos. |

## I. Próximas ações recomendadas

| Ação | Arquivo/módulo | Dependência | Impacto | Prioridade |
|---|---|---|---|---|
| Validar o novo fluxo de solicitação como ADOPTER e a aprovação admin em ambiente com migrations aplicadas | `adoption-requests` e frontend | banco migrado e usuário adotante | confirma a integração ponta a ponta | Alta |
| Coletar e rotular outcomes reais ou fazer avaliação independente documentada | datasets e protocolo ML | consentimento, governança e especialistas | validade do TCC e das métricas | Crítica |
| Substituir atributos inferidos por dados avaliados ou marcá-los como desconhecidos | coleta real e `real_pets.py` | processo de avaliação comportamental | melhora rastreabilidade do score | Alta |
| Aplicar migrations em banco existente; atender ao preflight caso haja órfãos ou RGA duplicado | migration `20261112090000_add_explicit_relations` | backup e revisão dos registros sinalizados | ativa FKs sem descartar dados automaticamente | Alta |
| Implementar endpoints de recuperação ou adequar as telas | auth frontend/backend | mecanismo seguro de email/token | fluxo de conta completo | Média |
| Implementar endpoints de perdidos/encontrados e ligar suas páginas | novos módulos backend e frontend | modelagem de status e autorização | fecha os fluxos de comunicação pública | Média |
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

**Com base exclusivamente no código encontrado, o projeto sustenta parte relevante, mas não todo o escopo definido.** Site, Admin, API, autenticação, persistência configurada, Docker e pedido de adoção pelo perfil correspondente existem no código. As relações e migrations no Compose foram implementadas. Permanecem ausentes o backend de perdidos/encontrados e validação empírica do ML com dados/outcomes reais. A existência de telas de senha não comprova recuperação funcional. Esta auditoria documenta configuração/código e não afirma que os containers estavam ativos no momento da leitura.
