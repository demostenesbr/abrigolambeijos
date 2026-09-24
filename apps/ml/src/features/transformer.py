"""Monta o Pipeline completo (pré-processamento + estimador)."""

from sklearn.base import BaseEstimator
from sklearn.pipeline import Pipeline

from .encoder import build_preprocessor


def build_pipeline(estimator: BaseEstimator) -> Pipeline:
    return Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            ("estimator", estimator),
        ]
    )
