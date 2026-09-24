"""Ranking de pets para um adotante, usando o modelo de compatibilidade.

Não é um microserviço — chamado localmente pelo backend (via subprocess ou
binding Python) ou por scripts/notebooks internos ao próprio `apps/ml`.
"""

import pandas as pd

from .predictor import predict_compatibility


def recommend_pets(adopter_profile: dict, pets: pd.DataFrame, top_n: int = 5) -> pd.DataFrame:
    """`adopter_profile` deve conter as colunas do adotante usadas em
    FEATURE_COLUMNS (home_type, has_yard, has_children, etc). `pets` é um
    DataFrame no formato de `pets.csv`. Retorna os `top_n` pets com maior
    score de compatibilidade prevista."""
    scored = pets.copy()
    scored["compatibility_score"] = scored.apply(
        lambda pet: predict_compatibility(
            {
                **adopter_profile,
                "pet_energy_level": pet["energy_level"],
                "pet_temperament": pet["temperament"],
                "pet_sociability": pet["sociability"],
                "children_compatibility": pet["children_compatibility"],
                "dogs_compatibility": pet["dogs_compatibility"],
                "cats_compatibility": pet["cats_compatibility"],
                "exercise_need": pet["exercise_need"],
                "apartment_adaptability": pet["apartment_adaptability"],
                "pet_age": pet["age"],
            }
        ),
        axis=1,
    )
    return scored.sort_values("compatibility_score", ascending=False).head(top_n)
