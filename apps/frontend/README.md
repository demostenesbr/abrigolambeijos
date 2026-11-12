# Frontend — Site público

Site Next.js 16 App Router, React 19 e TypeScript. Em desenvolvimento: `http://localhost:3000`. API centralizada em `app/services/api.ts`, URL `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3001`). O cliente envia token Bearer do navegador e limpa sessão local quando recebe 401.

## Rotas encontradas

`/`, `/animais`, `/adotar`, `/recomendacao`, `/perdidos`, `/resgastes`, `/parceiros`, `/doacoes`, `/sobre`, `/contato`, `/cadastro`, `/entrar`, `/perfil`, `/esqueci-senha`, `/redefinicao-senha`, `/politica-de-privacidade`, `/termos-de-uso`.

`/perdidos` e `/resgastes` têm telas, mas não foi localizado módulo backend equivalente para perdidos/encontrados. Não há rota App Router `/encontrados`; existem componentes sob `app/pages/found/` sem rota visível.

## Estrutura `app/`

- Diretórios de rota App Router para páginas listadas acima.
- `components/layout/`: navegação, chrome, footer, consentimento e monitor de sessão; `components/stats/`: indicadores.
- `pages/`: componentes de domínio para adoção, auth, pets, contato, doações, parceiros, perfil, recomendação, resgate e termos.
- `services/`: wrapper HTTP, autenticação, estatísticas e parceiros públicos.
- `hooks/`, `styles/`, `assets/`, `data/`: sessão, CSS, imagens e dados locais; `public/pets/` contém fotos web.

## Integrações comprovadas

- Cadastro/login: `POST /auth/register`, `POST /auth/login`.
- Perfil: `GET /auth/me`, `PATCH /users/:id` do próprio usuário.
- Recomendação: `POST /recommendations/me`.
- Conteúdo público: `GET /partners/public`, `GET /stats`, `GET /donations/summary`.
- Candidatura de parceiro: `POST /partners/applications`.

Não há endpoint público de criação de pedido de adoção: `/adoption-requests` está protegido para admin. A existência de uma tela ou wrapper não comprova integração. Veja os contratos em [README do backend](../backend/README.md).

```bash
npm run dev
npm run build
npm run lint
npm run generate:pets
```

Em Docker, porta 3000. `NEXT_PUBLIC_API_URL` deve ser alcançável pelo navegador.
