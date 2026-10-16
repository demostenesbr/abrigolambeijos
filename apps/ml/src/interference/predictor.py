"""Carrega o modelo persistido e prediz a probabilidade de compatibilidade."""

import json
import warnings

import joblib
import pandas as pd
import sklearn

from ..config.settings import (
    BOOLEAN_COLUMNS,
    FEATURE_COLUMNS,
    MODEL_METADATA_PATH,
    MODEL_PATH,
    NOMINAL_COLUMNS,
    NUMERIC_COLUMNS,
    ORDINAL_COLUMNS,
)

_model = None


class InvalidFeaturesError(ValueError):
    """Entrada de inferência com colunas ausentes, nulas ou fora do domínio."""


def _warn_on_sklearn_mismatch() -> None:
    if not MODEL_METADATA_PATH.exists():
        return
    trained_with = json.loads(MODEL_METADATA_PATH.read_text(encoding="utf-8")).get(
        "sklearn_version"
    )
    if trained_with and trained_with != sklearn.__version__:
        warnings.warn(
            f"Modelo treinado com scikit-learn {trained_with}, ambiente usa "
            f"{sklearn.__version__}. Re-treine com `python -m src.training.train`.",
            stacklevel=3,
        )


def _get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Modelo não encontrado em {MODEL_PATH}. Rode "
                "`python -m src.training.train` antes de usar o predictor."
            )
        _warn_on_sklearn_mismatch()
        _model = joblib.load(MODEL_PATH)
    return _model


def validate_features(frame: pd.DataFrame) -> pd.DataFrame:
    """Valida e normaliza o DataFrame de features; levanta InvalidFeaturesError."""
    missing = [col for col in FEATURE_COLUMNS if col not in frame.columns]
    if missing:
        raise InvalidFeaturesError(f"Features ausentes: {missing}")

    frame = frame[FEATURE_COLUMNS].copy()
    null_columns = frame.columns[frame.isna().any()].tolist()
    if null_columns:
        raise InvalidFeaturesError(f"Valores nulos/NaN em: {null_columns}")

    for column, levels in ORDINAL_COLUMNS.items():
        invalid = set(frame[column].unique()) - set(levels)
        if invalid:
            raise InvalidFeaturesError(
                f"Valores inválidos em '{column}': {sorted(map(str, invalid))} "
                f"(esperado: {levels})"
            )

    for column in NOMINAL_COLUMNS:
        if not frame[column].map(lambda v: isinstance(v, str)).all():
            raise InvalidFeaturesError(f"'{column}' deve conter apenas texto.")

    for column in NUMERIC_COLUMNS:
        numeric = pd.to_numeric(frame[column], errors="coerce")
        if numeric.isna().any():
            raise InvalidFeaturesError(f"'{column}' deve ser numérico.")
        frame[column] = numeric.astype(float)

    for column in BOOLEAN_COLUMNS:
        if not frame[column].map(lambda v: v in (True, False)).all():
            raise InvalidFeaturesError(f"'{column}' deve ser booleano.")
        frame[column] = frame[column].astype(int)

    return frame


def predict_compatibility_batch(frame: pd.DataFrame) -> list[float]:
    """Probabilidades (0.0 a 1.0) de compatibilidade, uma por linha."""
    model = _get_model()
    return model.predict_proba(validate_features(frame))[:, 1].astype(float).tolist()


def predict_compatibility(features: dict) -> float:
    """Recebe um dict com as chaves de FEATURE_COLUMNS e retorna a
    probabilidade (0.0 a 1.0) do par adotante-pet ser compatível."""
    return predict_compatibility_batch(pd.DataFrame([features]))[0]
