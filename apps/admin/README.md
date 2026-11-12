# Admin — Painel administrativo

Aplicação React 19 + TypeScript + Vite 8, em `http://localhost:5173`. O router redireciona `/` para `/admin/home`. Páginas usam `src/services/api.ts` e consomem a API HTTP, não PostgreSQL.

## Rotas SPA

`/admin/home`, `/admin/perfil`, `/admin/pets`, `/admin/adotantes`, `/admin/solicitacoes`, `/admin/adocoes`, `/admin/resgates`, `/admin/doacoes`, `/admin/recomendacoes`, `/admin/modelo-ia`, `/admin/parceiros`.

Login fica no site público (`/entrar`). `adminAuth.ts` lê o token; o cliente HTTP envia `Authorization: Bearer ...` e usa `VITE_API_URL` (padrão `http://localhost:3001`). `VITE_FRONTEND_URL` aponta para o site.

## Estrutura `src/`

- `assets/`: logos, ícones e fotos; `assets/pets/WEBP/` guarda imagens otimizadas.
- `components/`: UI comum e componentes de `users`, `pets`, `adopters`, `adoption-requests`, `adoptions`, `rescues`, `donations`, `partners`, `recommendations`, `dashboard`.
- `config/`, `contexts/`, `hooks/`: ambiente, estado de autenticação e hooks de dados/ações.
- `layouts/`: `AdminLayout`, `AuthLayout`, rodapé.
- `pages/`: dashboard, perfil e páginas dos recursos acima, mais relatório ML.
- `routes/`: router, `AppRoutes`, `ProtectedRoute`.
- `services/`: API, autenticação e serviços por recurso (`pets`, `users`, `adopters`, `adoptions`, `adoption-requests`, `rescues`, `donations`, `partners`, `recommendation`).
- `styles/`, `types/`, `utils/`, `workers/`: estilos, tipos, validação/formatação/permissões e worker de fotos.

## Integrações

Usa `/stats/admin`, CRUD admin de pets, adotantes, solicitações, adoções, resgates, doações, recomendações, parceiros e usuário autenticado (`/auth/me`, `/users/:id`), além de `/recommendations/model/report`. Endpoints detalhados e seus guards estão em [README do backend](../backend/README.md). O backend é a fonte de autorização.

```bash
npm run dev
npm run build
npm run lint
```
