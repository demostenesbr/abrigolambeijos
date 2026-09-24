"""Avaliação de um pipeline treinado sobre um conjunto de teste."""

from sklearn.pipeline import Pipeline

from .metrics import compute_metrics


def evaluate_pipeline(pipeline: Pipeline, X_test, y_test) -> dict:
    y_pred = pipeline.predict(X_test)
    return compute_metrics(y_test, y_pred)
