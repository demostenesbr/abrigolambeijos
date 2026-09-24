"""Separa o dataset de compatibilidade em matriz de features (X) e alvo (y)."""

import pandas as pd

from ..config.settings import BOOLEAN_COLUMNS, FEATURE_COLUMNS, TARGET_COLUMN


def build_features_and_target(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    X = df[FEATURE_COLUMNS].copy()
    for column in BOOLEAN_COLUMNS:
        X[column] = X[column].astype(int)
    y = df[TARGET_COLUMN].astype(int)
    return X, y
