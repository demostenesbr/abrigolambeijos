# ML — Abrigo Lambeijos

## Definição da etapa de Machine Learning

| Item | Descrição |
|---|---|
| **Problema** | Indicar, para um adotante, quais animais do abrigo têm maior chance de adoção bem-sucedida. |
| **Dados de entrada** | 11 atributos do adotante (moradia, quintal, crianças, outros pets, experiência, tempo, atividade, porte e idade preferidos) + 9 atributos do animal (energia, temperamento, sociabilidade, necessidade de exercício, adaptação a apartamento, compatibilidade com crianças/cães/gatos, idade). Ver `src/config/settings.py`. |
| **Tarefa** | Classificação binária: o par adotante × animal é compatível (1) ou não (0)? |
| **Modelo** | Candidatos: árvore de decisão, Random Forest, regressão logística e KNN, comparados por validação cruzada (F1). O Random Forest foi o escolhido. |
| **Saída** | Probabilidade de compatibilidade (0 a 1) por animal; o ranking ordena os animais por essa probabilidade. |
| **Uso na interface** | Página `/recomendacao` do frontend → `POST /recommendations/me` (backend) → `python -m src.interference.cli` → ranking dos pets cadastrados no banco. |
| **Avaliação** | Accuracy, precision, recall, F1 e matriz de confusão, comparados a um baseline (classe majoritária). |

## Datasets e tamanhos

| Arquivo | Linhas | Origem | Vai para o banco? |
|---|---|---|---|
| `datasets/raw/pets.csv` | 1.500 | Sintético (`generate_datasets.py`) | **Não**: só para simulação, treino e notebooks |
| `datasets/raw/compatibility_dataset.csv` | 750 (150 adotantes × 5 pares) | Sintético, rótulo por regra | **Não** |
| `datasets/raw/real_pets.csv` | 8 (cresce com o Google Forms) | Cães reais do abrigo | Via `pets_processed.csv` |
| `datasets/processed/pets_processed.csv` | 8 | Derivado de `real_pets.csv` | **Sim**, por `npm run import:real-pets` |

O `import:real-pets` lê somente `pets_processed.csv`; nenhum script grava o `pets.csv` sintético na tabela `Pets`.

## Como executar

```powershell
cd apps/ml
.venv\Scripts\python.exe src/data/generate_datasets.py   # regenera os datasets sintéticos
.venv\Scripts\python.exe -m src.training.train           # treina, avalia e salva o modelo
.venv\Scripts\python.exe -m pytest tests -q              # testes de inferência
```

## Resultados atuais (conjunto de teste, 150 pares / 30 adotantes)

| Modelo | F1 (CV) | F1 (teste) | Accuracy (teste) |
|---|---|---|---|
| Baseline (classe majoritária) | 0,710 | 0,723 | — |
| Random Forest (selecionado) | 0,832 | 0,826 | 0,807 |

Detalhes em `artfacts/reports/` e nos notebooks de `notebooks/`.

## Limitações

- **Rótulos sintéticos:** `compatibility` é calculado por uma regra (`src/data/generate_datasets.py`), não por adoções reais. O modelo aprende essa regra; as métricas não medem acerto em adoções reais.
- **Base pequena:** catálogo sintético de 1.500 animais (`pets.csv`), mas só 150 adotantes × 5 pares = 750 linhas rotuladas. Os dados sintéticos ficam em `datasets/raw/pets.csv` e nunca entram em `real_pets.csv` nem no banco.
- **Classes levemente desbalanceadas:** cerca de 55% / 45%. Por isso o F1 é comparado a um baseline.
- **Avaliação por adotante:** treino e teste não compartilham adotantes (`GroupShuffleSplit` e `StratifiedGroupKFold`), para evitar avaliação otimista.
- **Atributos dos cães reais inferidos:** `datasets/raw/real_pets.csv` (exportação do Google Forms, versionado no git) não pergunta energia, sociabilidade, exercício, adaptação a apartamento nem compatibilidade com crianças/cães/gatos. `src/data/real_pets.py::infer_ml_attributes` preenche esses campos por regra (idade, porte e perfil comportamental; gatos sempre `False`). São suposições, marcadas com `attributes_source = inferred`; as recomendações para esses cães refletem essas regras, não observação direta.
- **Privacidade:** o CSV bruto traz e-mail, responsável e link de foto. `src/data/real_pets.py` descarta essas colunas; o `pets_processed.csv` não contém dados pessoais.

## Atualizando os cães reais

```powershell
# 1. Exporte a planilha do Google Forms para apps/ml/datasets/raw/real_pets.csv
cd apps/ml
.venv\Scripts\python.exe -m src.data.export_real_pets   # gera datasets/processed/pets_processed.csv
cd ../backend
npm run import:real-pets                                 # insere/atualiza os cães no banco (idempotente)
```
