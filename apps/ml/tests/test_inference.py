import pandas as pd
import pytest

from src.config.settings import FEATURE_COLUMNS, METRICS_PATH, MODEL_PATH
from src.data.loader import load_compatibility_dataset, load_pets
from src.interference.predictor import (
    InvalidFeaturesError,
    predict_compatibility,
    validate_features,
)
from src.interference.recommender import recommend_pets

PROFILE = {
    "home_type": "Apartment",
    "has_yard": False,
    "has_children": False,
    "children_age_group": "NOT_APPLICABLE",
    "has_other_pets": False,
    "other_pets_type": "NONE",
    "dog_experience": "Beginner",
    "available_time": "Low",
    "activity_level": "Low",
    "preferred_size": "Small",
    "preferred_age": "Adulto",
}


def _row() -> dict:
    return load_compatibility_dataset().iloc[0][FEATURE_COLUMNS].to_dict()


def test_model_artifact_exists():
    assert MODEL_PATH.exists()
    assert METRICS_PATH.exists()


def test_score_in_unit_interval():
    assert 0.0 <= predict_compatibility(_row()) <= 1.0


def test_missing_feature_rejected():
    row = _row()
    del row["pet_age"]
    with pytest.raises(InvalidFeaturesError):
        predict_compatibility(row)


def test_nan_rejected():
    row = _row()
    row["pet_age"] = float("nan")
    with pytest.raises(InvalidFeaturesError):
        predict_compatibility(row)


def test_invalid_ordinal_rejected():
    row = _row()
    row["available_time"] = "Huge"
    with pytest.raises(InvalidFeaturesError):
        validate_features(pd.DataFrame([row]))


def test_ranking_sorted_and_sized():
    ranked = recommend_pets(PROFILE, load_pets(), top_n=5)
    scores = ranked["compatibility_score"].tolist()
    assert len(ranked) == 5
    assert scores == sorted(scores, reverse=True)
