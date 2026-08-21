# Abrigo Lambeijos
Um projeto dedicado ao resgate de animais, animais perdidos e encontrados, e à saúde animal.

# NestJs com MySQL
[https://docs.nestjs.com/techniques/database] - https://docs.nestjs.com/techniques/database

# Ecossistema de Desenvolvimento - Abrigo Lambeijos com CMS Modular

Este repositório utiliza a arquitetura de **Monorepo** com **NPM/Yarn Workspaces** para gerenciar de forma centralizada as aplicações de Frontend, Backend e Painel Administrativo (Admin).

---

## 🏗️ Arquitetura do Projeto

A estrutura física adota o padrão onde todas as aplicações executáveis e independentes residem estritamente dentro do diretório `apps/`.

```text
abrigolambeijos/
├── package.json             # Configuração do Workspace raiz
├── README.md                # Documentação do ecossistema
└── apps/                    # Centralização das aplicações
    ├── backend/             # API REST (NestJS + Prisma)
    ├── frontend/            # Site Público (React / Vite ou Next.js)
    └── admin/               # Painel CMS (React + Vite)
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`apps/backend`)
* **NestJS:** Framework Node.js robusto, tipado e escalável para arquitetura de microsserviços ou monólitos modulares.
* **Prisma ORM:** Abstração e manipulação de banco de dados com total suporte a TypeScript.

### Interfaces (`apps/frontend` & `apps/admin`)
* **React:** Biblioteca base para a construção das interfaces reativas.
* **Vite:** Ferramenta de build rápida e leve, ideal para o ecossistema React (especialmente para o painel Admin).
* **Next.js (Opcional para o Frontend):** Recomendado para o site público caso haja necessidade de SEO (indexação em motores de busca).

---

## ⚙️ Boas Práticas Implementadas

1. **Separação de Responsabilidades:** O site público (`frontend`) e o gerenciador de conteúdo (`admin`) são projetos React isolados. Se o painel admin falhar, a experiência do cliente final no site não é afetada.
2. **Autenticação Centralizada e RBAC:** O `admin` consome as rotas do `backend` enviando credenciais. O NestJS valida o acesso e bloqueia rotas sensíveis de edição usando *Guards* baseados em regras (ex: `role: 'admin'`).
3. **Compartilhamento de Tipos:** Por estarem no mesmo Monorepo, as interfaces TypeScript e entidades do banco geradas pelo Prisma podem ser facilmente compartilhadas entre o backend e os frontends.
4. **Builds Independentes:** Cada aplicação gera seu próprio pacote de deploy, otimizando o consumo de recursos e permitindo pipelines de CI/CD específicas.

---

## 🚀 Como Iniciar o Workspace

### Configuração do `package.json` Raiz
Para que o gerenciador de pacotes reconheça a estrutura, o arquivo `package.json` na raiz do projeto deve conter:

```json
{
  "name": "abrigolambeijos",
  "private": true,
  "workspaces": [
    "apps/*"
  ]
}
```

### Comandos Iniciais
Instale todas as dependências de uma única vez a partir da raiz:
```bash
npm install
```

Para rodar um app específico a partir da raiz:
```bash
npm run dev --workspace=apps/backend
```
```bash
npm run dev --workspace=apps/admin
```
```bash
npm run dev --workspace=apps/frontend
```
