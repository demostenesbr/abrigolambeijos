"""Carrega o modelo persistido e prediz a probabilidade de compatibilidade."""

import joblib
import pandas as pd

from ..config.settings import FEATURE_COLUMNS, MODEL_PATH

_model = None


def _get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Modelo não encontrado em {MODEL_PATH}. Rode "
                "`python -m src.training.train` antes de usar o predictor."
            )
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_compatibility(features: dict) -> float:
    """Recebe um dict com as chaves de FEATURE_COLUMNS e retorna a
    probabilidade (0.0 a 1.0) do par adotante-pet ser compatível."""
    model = _get_model()
    row = pd.DataFrame([{col: features[col] for col in FEATURE_COLUMNS}])
    return float(model.predict_proba(row)[0][1])
