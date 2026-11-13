import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { apiErrorMessage } from "../../utils/adminFormatters";

interface CrossValidation {
  f1_mean: number;
  f1_std: number;
  folds: number[];
}

interface ModelReport {
  metadata: {
    model_name: string;
    trained_at: string;
    feature_columns: string[];
    train_size: number;
    test_size: number;
  };
  evaluation: {
    candidates: Record<string, CrossValidation>;
    baseline_most_frequent: { cv: CrossValidation; test: { f1: number } };
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    confusion_matrix: [[number, number], [number, number]];
  };
  catalog: { syntheticPets: number; realPets: number };
}

const modelNames: Record<string, string> = {
  random_forest: "Random Forest",
  decision_tree: "Árvore de decisão",
  logistic_regression: "Regressão logística",
  knn: "KNN",
};

const featureNames: Record<string, string> = {
  available_time: "Tempo disponível",
  activity_level: "Nível de atividade",
  dog_experience: "Experiência com cães",
  home_type: "Tipo de moradia",
  children_age_group: "Faixa etária das crianças",
  other_pets_type: "Tipo de outros pets",
  preferred_size: "Porte preferido",
  preferred_age: "Idade preferida",
  has_yard: "Tem quintal",
  has_children: "Tem crianças",
  has_other_pets: "Tem outros pets",
  pet_energy_level: "Energia do pet",
  pet_sociability: "Sociabilidade do pet",
  exercise_need: "Necessidade de exercício",
  apartment_adaptability: "Adaptação a apartamento",
  pet_temperament: "Temperamento do pet",
  children_compatibility: "Compatibilidade com crianças",
  dogs_compatibility: "Compatibilidade com cães",
  cats_compatibility: "Compatibilidade com gatos",
  pet_age: "Idade do pet",
};

const percent = (value: number) =>
  `${(value * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const number = (value: number) => value.toLocaleString("pt-BR");
const card = "rounded-2xl border border-[#E8E0F0] bg-white p-5 shadow-sm";

export default function AdminAIModel() {
  const [report, setReport] = useState<ModelReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get<ModelReport>("/recommendations/model/report", controller.signal)
      .then(setReport)
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(apiErrorMessage(requestError));
      });
    return () => controller.abort();
  }, []);

  const cv = report?.evaluation.candidates[report.metadata.model_name];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-[#F28C28]">Inteligência do abrigo</p>
        <h1 className="mt-1 text-3xl font-black text-[#2F2140]">
          Modelo de ML{report ? ` · ${modelNames[report.metadata.model_name] ?? report.metadata.model_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[#78909C]">
          Classificação de compatibilidade entre adotante e animal para apoiar recomendações.
        </p>
      </header>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!report && !error && <p className="text-sm text-[#78909C]">Carregando resultados do modelo...</p>}

      {report && cv && (
        <>
          <section aria-label="Resumo das bases" className="grid gap-4 rounded-2xl bg-[#1A1033] p-6 text-white sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Animais sintéticos", value: report.catalog.syntheticPets, detail: "catálogo sintético atual" },
              { label: "Cães reais", value: report.catalog.realPets, detail: "arquivo processado atual" },
              { label: "Pares rotulados", value: report.metadata.train_size + report.metadata.test_size, detail: "usados na avaliação do modelo" },
              { label: "Atributos de entrada", value: report.metadata.feature_columns.length, detail: "adotante e animal" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-black text-[#F28C28]">{number(item.value)}</p>
                <p className="text-sm font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-[#C8BBD9]">{item.detail}</p>
              </div>
            ))}
          </section>

          <section aria-labelledby="metrics-title">
            <h2 id="metrics-title" className="mb-3 text-lg font-bold text-[#2F2140]">Métricas sobre rótulos sintéticos</h2>
            <p className="mb-3 text-sm text-[#78909C]">Teste separado: {number(report.metadata.test_size)} pares. Este resultado mede concordância com rótulos heurísticos sintéticos, não taxa de adoção bem-sucedida.</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Acurácia", value: report.metrics.accuracy },
                { label: "Precisão", value: report.metrics.precision },
                { label: "Recall", value: report.metrics.recall },
                { label: "F1-score", value: report.metrics.f1 },
              ].map((metric) => (
                <div key={metric.label} className={card}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#78909C]">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#4D246A]">{percent(metric.value)}</p>
                  <p className="mt-1 text-xs text-[#78909C]">conjunto de teste</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className={card} aria-labelledby="cv-title">
              <h2 id="cv-title" className="font-bold text-[#2F2140]">Validação cruzada ({cv.folds.length} folds)</h2>
              <p className="mt-1 text-sm text-[#78909C]">F1 médio {percent(cv.f1_mean)} ± {percent(cv.f1_std)}</p>
              <div className="mt-5 space-y-3">
                {cv.folds.map((fold, index) => (
                  <div key={index} className="flex items-center gap-3 text-xs">
                    <span className="w-12 shrink-0 text-[#78909C]">Fold {index + 1}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F3F0F8]">
                      <div className="h-full rounded-full bg-[#4D246A]" style={{ width: `${fold * 100}%` }} />
                    </div>
                    <span className="w-12 text-right font-bold text-[#4D246A]">{percent(fold)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-[#78909C]">Os adotantes são separados entre treino e teste e agrupados na validação cruzada. Baseline de classe majoritária: F1 {percent(report.evaluation.baseline_most_frequent.cv.f1_mean)} na validação e {percent(report.evaluation.baseline_most_frequent.test.f1)} no teste.</p>
            </section>

            <section className={card} aria-labelledby="matrix-title">
              <h2 id="matrix-title" className="font-bold text-[#2F2140]">Matriz de confusão</h2>
              <p className="mt-1 text-xs text-[#78909C]">Teste: valores reais × previsões</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Verdadeiro positivo", value: report.metrics.confusion_matrix[1][1], color: "bg-[#E8F5E9] text-[#318B3B]" },
                  { label: "Falso positivo", value: report.metrics.confusion_matrix[0][1], color: "bg-[#FCE4EC] text-[#C84040]" },
                  { label: "Falso negativo", value: report.metrics.confusion_matrix[1][0], color: "bg-[#FFF3E0] text-[#C46B0A]" },
                  { label: "Verdadeiro negativo", value: report.metrics.confusion_matrix[0][0], color: "bg-[#E8F5E9] text-[#318B3B]" },
                ].map((cell) => (
                  <div key={cell.label} className={`rounded-xl p-4 text-center ${cell.color}`}>
                    <p className="text-xl font-black">{number(cell.value)}</p>
                    <p className="mt-1 text-xs font-semibold">{cell.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className={card} aria-labelledby="models-title">
            <h2 id="models-title" className="font-bold text-[#2F2140]">Comparação dos modelos</h2>
            <p className="mt-1 text-sm text-[#78909C]">F1 médio na validação cruzada; o maior resultado determina o modelo selecionado.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(report.evaluation.candidates).map(([name, result]) => (
                <div key={name} className="rounded-xl bg-[#F5F1F8] p-4">
                  <p className="text-sm font-semibold text-[#2F2140]">{modelNames[name] ?? name}{name === report.metadata.model_name ? " · selecionado" : ""}</p>
                  <p className="mt-1 text-xl font-black text-[#4D246A]">{percent(result.f1_mean)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={card} aria-labelledby="features-title">
            <h2 id="features-title" className="font-bold text-[#2F2140]">Atributos de entrada</h2>
            <p className="mt-1 text-sm text-[#78909C]">Variáveis registradas no modelo treinado. Os relatórios atuais não disponibilizam a importância das variáveis.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {report.metadata.feature_columns.map((feature) => (
                <span key={feature} title={feature} className="rounded-full bg-[#F5F1F8] px-3 py-1.5 text-xs font-semibold text-[#4D246A]">
                  {featureNames[feature] ?? feature}
                </span>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#F5D4A8] bg-[#FFF3E0] p-5 text-sm leading-6 text-[#70450F]">
            <h2 className="font-bold">Como interpretar estes resultados</h2>
            <p className="mt-1">Os pares de treino e teste são sintéticos e sua compatibilidade é definida por regras, não por adoções reais. O catálogo sintético e os cães reais são bases separadas: os cães reais não compõem os pares de avaliação. Para eles, alguns atributos usados nas recomendações são inferidos por regras e não observados diretamente. Assim, as métricas não demonstram desempenho em adoções reais.</p>
            <p className="mt-2">Treinamento registrado em {new Date(report.metadata.trained_at).toLocaleDateString("pt-BR", { timeZone: "UTC" })}; {number(report.metadata.train_size)} pares de treino e {number(report.metadata.test_size)} de teste. Os totais de animais refletem os arquivos atuais e podem mudar após a atualização das bases.</p>
          </aside>
        </>
      )}

      <aside className="flex flex-col justify-between gap-4 rounded-2xl bg-[#1A1033] p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold">Acompanhe os resultados</h2>
          <p className="mt-1 text-sm text-[#C8BBD9]">O modelo estima a compatibilidade e ordena os animais para apoiar a escolha do adotante.</p>
        </div>
        <Link to="/admin/recomendacoes" className="shrink-0 rounded-full bg-[#F28C28] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#DF7815]">
          Ver recomendações
        </Link>
      </aside>
    </div>
  );
}
