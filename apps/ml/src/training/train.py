"""Treina, compara e persiste o modelo de compatibilidade adotante-pet.

Modelos candidatos avaliados por validação cruzada (5-fold, métrica F1):
    Decision Tree, Random Forest, Logistic Regression, KNN.

O melhor candidato (maior F1 médio em CV) é re-treinado no conjunto de
treino completo, avaliado no conjunto de teste (holdout, nunca visto durante
CV) e persistido em `models/animal-recommender/model.joblib`.

Uso:
    apps/ml/.venv/Scripts/python.exe -m src.training.train
"""

from datetime import datetime, timezone

import joblib
from sklearn.model_selection import train_test_split

from ..config.settings import (
    EVALUATION_REPORT_PATH,
    METRICS_PATH,
    MODEL_DIR,
    MODEL_METADATA_PATH,
    MODEL_PATH,
    RANDOM_STATE,
    TEST_SIZE,
)
from ..data.cleaner import clean_compatibility_dataset
from ..data.loader import load_compatibility_dataset
from ..evaluation.evaluator import evaluate_pipeline
from ..evaluation.reports import save_json_report
from ..features.feature_builder import build_features_and_target
from ..features.transformer import build_pipeline
from ..models.decision_tree import build_decision_tree
from ..models.knn import build_knn
from ..models.logistic_regression import build_logistic_regression
from ..models.random_forest import build_random_forest
from .cross_validation import cross_validate_pipeline

CANDIDATES = {
    "decision_tree": build_decision_tree(RANDOM_STATE),
    "random_forest": build_random_forest(RANDOM_STATE),
    "logistic_regression": build_logistic_regression(RANDOM_STATE),
    "knn": build_knn(),
}


def main() -> None:
    df = clean_compatibility_dataset(load_compatibility_dataset())
    X, y = build_features_and_target(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )

    cv_results = {}
    for name, estimator in CANDIDATES.items():
        pipeline = build_pipeline(estimator)
        cv_results[name] = cross_validate_pipeline(pipeline, X_train, y_train)
        print(f"[CV] {name}: F1 médio = {cv_results[name]['f1_mean']:.3f}")

    best_name = max(cv_results, key=lambda name: cv_results[name]["f1_mean"])
    print(f"Melhor modelo (CV): {best_name}")

    best_pipeline = build_pipeline(CANDIDATES[best_name])
    best_pipeline.fit(X_train, y_train)
    test_metrics = evaluate_pipeline(best_pipeline, X_test, y_test)
    print(f"[TEST] {best_name}: {test_metrics}")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, MODEL_PATH)

    metadata = {
        "model_name": best_name,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "feature_columns": list(X.columns),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "cv_f1_mean": cv_results[best_name]["f1_mean"],
    }
    save_json_report(metadata, MODEL_METADATA_PATH)
    save_json_report(
        {"candidates": cv_results, "selected_model": best_name}, EVALUATION_REPORT_PATH
    )
    save_json_report(test_metrics, METRICS_PATH)

    print(f"Modelo salvo em {MODEL_PATH}")


if __name__ == "__main__":
    main()
