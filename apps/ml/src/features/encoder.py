"""Construção do ColumnTransformer de pré-processamento (encoding + scaling)."""

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

from ..config.settings import (
    BOOLEAN_COLUMNS,
    NOMINAL_COLUMNS,
    NUMERIC_COLUMNS,
    ORDINAL_COLUMNS,
)


def build_preprocessor() -> ColumnTransformer:
    ordinal_columns = list(ORDINAL_COLUMNS.keys())
    ordinal_categories = list(ORDINAL_COLUMNS.values())

    return ColumnTransformer(
        transformers=[
            (
                "ordinal",
                OrdinalEncoder(categories=ordinal_categories),
                ordinal_columns,
            ),
            (
                "nominal",
                OneHotEncoder(handle_unknown="ignore"),
                NOMINAL_COLUMNS,
            ),
            ("numeric", StandardScaler(), NUMERIC_COLUMNS),
            ("boolean", "passthrough", BOOLEAN_COLUMNS),
        ]
    )
