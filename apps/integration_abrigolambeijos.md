# Auditoria de Escopo e Integração — Abrigo Lambeijos

## Objetivo

Analise o repositório atual do Abrigo Lambeijos e compare o escopo arquitetural/funcional definido com o que está realmente implementado.

Audite especialmente a integração entre:
- `apps/frontend` — Next.js + React + TypeScript
- `apps/admin` — React + Vite + TypeScript
- `apps/backend` — NestJS + Prisma + PostgreSQL
- `apps/ml` — Python + scikit-learn

Não altere o código durante a auditoria. Primeiro produza diagnóstico. Não assuma que uma funcionalidade existe apenas porque há uma pasta, arquivo, rota ou componente com nome correspondente.

---

# 1. Escopo de referência

O Abrigo Lambeijos é uma plataforma digital para proteção animal com:
- adoção;
- animais perdidos;
- animais encontrados;
- resgates;
- doações;
- parceiros;
- autenticação de usuários;
- solicitações de adoção;
- recomendação de animais baseada em Machine Learning.

O núcleo acadêmico/tecnológico é o mecanismo de recomendação/classificação baseado em ML.

LLM é opcional e complementar. Não deve substituir o ML desenvolvido e avaliado pelo projeto.

Arquitetura desejada:

```text
Browser
  |
  +-------------------+
  |                   |
Frontend            Admin
Next.js             React/Vite
  |                   |
  +---------+---------+
            |
          Backend
          NestJS
            |
       +----+----+
       |         |
 PostgreSQL     ML
               Python
```

Se existir LLM:

```text
Backend
  |---- ML
  |
  +---- LLM (complementar)
```

O `ml` não precisa ser um microserviço HTTP. Pode ser um ambiente Python para exploração, preprocessing, treinamento, avaliação e inferência.

Evitar overengineering: não introduzir microservices, Kubernetes, Terraform, Kafka/RabbitMQ, vector DB, GPU ou outros componentes sem necessidade real.

---

# 2. Stack esperada

## Frontend
- Next.js
- React
- TypeScript
- App Router

Páginas esperadas:
```text
/
/animais
/recomendacao
/adocao
/perdidos
/encontrados
/resgates
/parceiros
/ajude
/sobre
/contato
/cadastro
/entrar
```

Menu:
- Início
- Adote
- Encontre seu companheiro
- Perdidos
- Encontrados
- Resgates
- Parceiros
- Ajude
- Sobre
- Contato

Verificar `NavMenu.tsx`, layout global, Header, Footer, Mobile Menu, responsividade, API, loading/error e proteção de rotas.

## Admin
React + Vite + TypeScript.

Deve administrar:
- usuários;
- animais;
- adoções;
- solicitações;
- resgates;
- doações;
- parceiros;
- recomendações.

O Admin deve consumir o Backend e não acessar PostgreSQL diretamente.

## Backend
NestJS + TypeScript + Prisma + PostgreSQL + REST.

Responsabilidades:
- autenticação;
- autorização/RBAC;
- regras de negócio;
- CRUD;
- validação;
- persistência;
- integração com ML;
- eventual integração complementar com LLM.

## ML
Python + pandas + scikit-learn.

Esperado:
```text
data/
notebooks/
src/data/
src/features/
src/models/
src/training/
src/evaluation/
src/inference/
artifacts/models/
artifacts/reports/
```

---

# 3. Autenticação e RBAC

Perfis esperados:

```text
ADOPTER
PROTECTOR
PARTNER
ADMIN
```

ou equivalentes em português.

Adotante:
- dashboard;
- perfil;
- recomendações;
- favoritos;
- solicitações.

Protetor:
- dashboard;
- perfil;
- seus animais;
- cadastro/atualização de animais;
- solicitações;
- resgates relacionados.

Parceiro:
- dashboard;
- perfil/organização;
- participações/campanhas.

Administrador:
- dashboard administrativo;
- usuários;
- animais;
- adoções;
- solicitações;
- resgates;
- doações;
- parceiros;
- recomendações;
- configurações.

Administrador deve poder editar, atualizar, ativar e desativar usuários.

Verifique se a autorização é realmente protegida no Backend. Esconder menu no frontend não é controle de acesso suficiente.

Verifique também `ACTIVE/INACTIVE` e se usuário inativo perde acesso.

---

# 4. Modelo de dados

Audite o Prisma schema comparando conceitualmente com:

```text
Users
Pets
Adopters
Adoptions
AdoptionRequests
Rescues
Donations
Recommendations
Partners
```

Campos importantes:

```text
Users:
id, email, name, password, role, status, createdAt, updatedAt

Pets:
id, name, species, age, size, type, breed, gender,
description, location, image, createdAt, updatedAt

Adopters:
id, name, email, phone, createdAt, updatedAt

Adoptions:
id, adopterId, animalId/petId, adoptionDate, createdAt, updatedAt

AdoptionRequests:
id, adopterId, animalId/petId, requestDate,
petName, userName, email, phone, address,
experience, home, status, createdAt, updatedAt

Rescues:
id, name, location, createdAt, updatedAt

Donations:
id, donorName, amount, createdAt, updatedAt

Recommendations:
id, adopterId, animalId/petId,
recommendationText, createdAt, updatedAt

Partners:
id, name, type, contact, email, phone,
address, city, state, country, description,
location, createdAt, updatedAt
```

Não altere nomes automaticamente. Registre diferenças.

Verifique relações Prisma explícitas.

---

# 5. Machine Learning

Audite:

1. carregamento de dados;
2. limpeza;
3. normalização;
4. encoding;
5. feature engineering;
6. train/test split;
7. treinamento;
8. avaliação;
9. comparação de modelos;
10. persistência do modelo;
11. inferência;
12. integração com Backend.

Modelos candidatos:
- Decision Tree;
- Random Forest;
- Logistic Regression;
- KNN.

Não assuma que todos foram implementados.

Métricas:
- accuracy;
- precision;
- recall;
- F1;
- confusion matrix;
- métricas de recomendação, quando aplicáveis.

Detecte:
- data leakage;
- overfitting;
- dataset pequeno;
- classes desbalanceadas;
- ausência de baseline;
- ausência de validação;
- labels frágeis.

---

# 6. Datasets

## pets.csv

Esperado aproximadamente:

```text
id,name,species,age,size,type,breed,gender,location,
energy_level,temperament,sociability,
children_compatibility,dogs_compatibility,cats_compatibility,
exercise_need,special_needs,vaccinated,neutered,trained,
apartment_adaptability,description
```

Verifique:
- existência;
- quantidade de registros;
- colunas;
- valores ausentes;
- duplicidades;
- inconsistências;
- compatibilidade com `Pets`.

Não usar `ip_address`, `createdAt` ou `updatedAt` como features de ML.

## pets_processed.csv

Deve representar os animais após limpeza, encoding e feature engineering.

## compatibility_dataset.csv

Esperado como pares adotante + pet:

```text
adopter_id
pet_id
home_type
has_yard
has_children
children_age_group
has_other_pets
other_pets_type
dog_experience
available_time
activity_level
preferred_size
preferred_age
pet_age
pet_energy_level
pet_temperament
pet_sociability
children_compatibility
dogs_compatibility
cats_compatibility
exercise_need
apartment_adaptability
compatibility
```

Target:
```text
compatibility = 0 ou 1
```

Audite criticamente como `compatibility` foi produzido.

Se não houver:
- dados reais de adoção;
- avaliação de especialistas;
- regra documentada;
- questionário estruturado;
- heurística justificável;

classifique como GAP CRÍTICO para o TCC.

Não considere labels aleatórios como metodologia adequada.

---

# 7. Fluxo de recomendação

Verifique se existe algo equivalente a:

```text
Frontend
  ↓
Formulário do adotante
  ↓
Backend
  ↓
validação
  ↓
Recommendation Module
  ↓
ML inference
  ↓
compatibility score
  ↓
ranking dos Pets
  ↓
Frontend
```

Identifique:
- endpoint;
- DTO;
- validação;
- chamada do modelo;
- tratamento de erros;
- score;
- ranking;
- explicação;
- persistência em `Recommendations`, se houver.

---

# 8. LLM

Se existir integração, identifique:
- provedor;
- modelo;
- finalidade;
- prompts;
- localização da integração;
- tratamento de erros;
- custos.

Classifique como:
- CORE ML; ou
- COMPLEMENTAR.

A classificação esperada é:

```text
ML = núcleo acadêmico
LLM = opcional/complementar
```

Exemplo:

```text
"Quero um cachorro tranquilo para apartamento."
             ↓
           LLM
             ↓
parâmetros estruturados
             ↓
          Backend
             ↓
       ML Recommendation
             ↓
      ranking de animais
```

O LLM não deve substituir o ML.

---

# 9. Integração entre serviços

Mapeie o fluxo real.

Esperado:

```text
Frontend --HTTP/REST--> Backend --Prisma--> PostgreSQL
Admin    --HTTP/REST--> Backend
Backend  -------------> ML
Backend  -------------> LLM (se existir)
```

O Frontend e o Admin não devem acessar PostgreSQL diretamente.

Para cada integração, informe:
- origem;
- destino;
- tecnologia;
- endpoint/interface;
- arquivo onde ocorre;
- estado.

Estados:
```text
FUNCIONAL
PARCIAL
AUSENTE
MAL DEFINIDA
```

---

# 10. Autenticação

Verifique:
- cadastro;
- login;
- hash de senha;
- JWT ou equivalente;
- refresh token, se usado;
- guards;
- roles guard;
- middleware;
- proteção de rotas;
- logout;
- expiração;
- usuário desativado.

O Backend deve ser a fonte de verdade para autorização.

---

# 11. Docker

Verifique:
- docker-compose;
- Dockerfiles;
- variáveis de ambiente;
- portas;
- dependências;
- ordem de inicialização;
- health checks;
- comunicação entre containers;
- persistência PostgreSQL.

Determine quais componentes realmente precisam de containers separados.

---

# 12. Inconsistências a procurar

Procure especificamente:
- frontend acessando banco diretamente;
- admin acessando banco diretamente;
- regras de negócio duplicadas;
- autenticação duplicada;
- roles apenas no frontend;
- secrets hardcoded;
- URLs hardcoded;
- CORS incorreto;
- imports quebrados;
- dependências sem uso;
- código morto;
- módulos sem integração;
- endpoints sem consumidor;
- consumidores sem endpoint;
- schemas divergentes;
- `Pet` versus `Animal`;
- `animalId` versus `petId`;
- divergência Prisma × CSV;
- divergência frontend × DTO;
- divergência ML features × banco.

---

# 13. Tabela obrigatória

Produza:

| Área | Escopo esperado | Encontrado | Status | Evidência | Gap |
|---|---|---|---|---|---|
| Frontend | Next.js/React | | | | |
| Admin | React/Vite | | | | |
| Backend | NestJS | | | | |
| Prisma | PostgreSQL | | | | |
| Auth | RBAC | | | | |
| ML | Python/scikit-learn | | | | |
| Dataset | pets.csv | | | | |
| Recommendation | ML inference | | | | |
| LLM | complementar | | | | |
| Integração | API | | | | |
| Docker | integração local | | | | |

Status permitidos:
```text
IMPLEMENTADO
PARCIAL
AUSENTE
INCONSISTENTE
NÃO FOI POSSÍVEL VERIFICAR
```

---

# 14. Matriz de integração

Produza:

| Origem | Destino | Tecnologia | Endpoint/Interface | Arquivo | Estado |
|---|---|---|---|---|---|
| Frontend | Backend | HTTP/REST | | | |
| Admin | Backend | HTTP/REST | | | |
| Backend | PostgreSQL | Prisma | | | |
| Backend | ML | local/import/process | | | |
| Backend | LLM | API | | | |

---

# 15. Resultado final

Entregue nesta ordem:

## A. Resumo executivo
Máximo de 10 pontos:
- estado atual;
- partes prontas;
- partes incompletas;
- integração existente;
- maior risco técnico;
- maior gap acadêmico.

## B. Mapa do projeto real
Mostre a estrutura encontrada no repositório.

## C. Escopo × implementação
Tabela completa.

## D. Integração
Explique frontend ↔ backend ↔ database ↔ ML ↔ LLM.

## E. Autenticação/RBAC
Explique o que realmente está protegido.

## F. Machine Learning
Explique dataset, preprocessing, features, modelo, treinamento, avaliação, inferência, artefatos e integração.

## G. Gaps
Classifique:
```text
CRÍTICO
ALTO
MÉDIO
BAIXO
```

## H. Próximas ações
Para cada ação:
- problema;
- arquivo/módulo;
- alteração sugerida;
- dependências;
- impacto;
- prioridade.

## I. Arquitetura recomendada
Mostre diagrama textual.

## J. Conclusão
Responda:
"Com base exclusivamente no código encontrado, o projeto atual consegue sustentar o escopo definido?"

Explique quais partes sustentam e quais precisam de implementação.

---

# Regra fundamental

Não invente implementação.

Se não houver evidência, escreva:

`NÃO FOI POSSÍVEL VERIFICAR`

Diferencie sempre:

```text
ESCOPO DEFINIDO
IMPLEMENTAÇÃO REAL
INFERÊNCIA
RECOMENDAÇÃO
```

Não trate recomendação arquitetural como funcionalidade existente.
