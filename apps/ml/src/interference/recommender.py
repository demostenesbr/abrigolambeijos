"""Ranking de pets para um adotante, usando o modelo de compatibilidade.

Não é um microserviço — chamado localmente pelo backend (via subprocess ou
binding Python) ou por scripts/notebooks internos ao próprio `apps/ml`.
"""

import pandas as pd

from .predictor import predict_compatibility_batch

_PET_TO_FEATURE = {
    "energy_level": "pet_energy_level",
    "temperament": "pet_temperament",
    "sociability": "pet_sociability",
    "children_compatibility": "children_compatibility",
    "dogs_compatibility": "dogs_compatibility",
    "cats_compatibility": "cats_compatibility",
    "exercise_need": "exercise_need",
    "apartment_adaptability": "apartment_adaptability",
    "age": "pet_age",
}


def recommend_pets(adopter_profile: dict, pets: pd.DataFrame, top_n: int = 5) -> pd.DataFrame:
    """`adopter_profile` deve conter as colunas do adotante usadas em
    FEATURE_COLUMNS (home_type, has_yard, has_children, etc). `pets` é um
    DataFrame no formato de `pets.csv`. Retorna os `top_n` pets com maior
    score de compatibilidade prevista."""
    scored = pets.copy()
    features = pd.DataFrame(
        {target: scored[source] for source, target in _PET_TO_FEATURE.items()}
    )
    for column, value in adopter_profile.items():
        features[column] = value
    scored["compatibility_score"] = predict_compatibility_batch(features)
    return scored.sort_values("compatibility_score", ascending=False).head(top_n)
