"""Limpeza básica de dados: duplicidades, tipos e valores ausentes.

Os datasets sintéticos gerados por `generate_datasets.py` já saem limpos,
mas esta função existe para dados reais futuros (ex: exportação do
Postgres/admin), onde duplicidade e valores ausentes são esperados.
"""

import pandas as pd


def clean_compatibility_dataset(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates(subset=["adopter_id", "pet_id"])
    df = df.dropna(subset=["compatibility"])
    boolean_columns = [
        "has_yard",
        "has_children",
        "has_other_pets",
        "children_compatibility",
        "dogs_compatibility",
        "cats_compatibility",
    ]
    for column in boolean_columns:
        if column in df.columns:
            df[column] = df[column].astype(bool)
    return df.reset_index(drop=True)
