import random

import pandas as pd
import pytest

from src.data.generate_datasets import (
    COMPATIBILITY_THRESHOLD,
    LEVELS,
    TEMPERAMENTS,
    _compatibility_score,
    generate_adopters,
    generate_compatibility_dataset,
    generate_pets,
    replace_cats,
)
from src.data.loader import load_compatibility_dataset, load_pets


def test_generated_catalog_contains_only_diverse_dogs():
    pets = generate_pets(random.Random(42))
    assert len(pets) == 1500
    assert set(pets["species"]) == {"Dog"}
    assert set(pets["type"]) == {"Canine"}
    assert set(pets["energy_level"]) == set(LEVELS)
    assert set(pets["temperament"]) == set(TEMPERAMENTS)
    assert pets["id"].is_unique
    assert all(
        temperament.lower() in description
        for temperament, description in zip(pets["temperament"], pets["description"])
    )


def test_replace_cats_preserves_dogs_and_updates_only_referenced_pairs():
    rng = random.Random(42)
    pets = generate_pets(rng).iloc[:10].copy()
    pets.loc[pets["id"].isin([2, 4]), "species"] = "Cat"
    adopters = generate_adopters(rng).iloc[:8]
    pairs = generate_compatibility_dataset(adopters, pets, rng)
    updated_pets, updated_pairs = replace_cats(pets, pairs, random.Random(42))

    pd.testing.assert_frame_equal(
        updated_pets.loc[~pets["id"].isin([2, 4])].reset_index(drop=True),
        pets.loc[~pets["id"].isin([2, 4])].reset_index(drop=True),
    )
    pd.testing.assert_frame_equal(
        updated_pairs.loc[~pairs["pet_id"].isin([2, 4])],
        pairs.loc[~pairs["pet_id"].isin([2, 4])],
    )
    assert set(updated_pets["species"]) == {"Dog"}
    for _, pair in updated_pairs.loc[pairs["pet_id"].isin([2, 4])].iterrows():
        pet = updated_pets.set_index("id").loc[pair["pet_id"]]
        assert pair["pet_energy_level"] == pet["energy_level"]
        assert pair["pet_temperament"] == pet["temperament"]
        assert pair["cats_compatibility"] == pet["cats_compatibility"]
        assert pair["compatibility"] == int(
            _compatibility_score(pair, pet) >= COMPATIBILITY_THRESHOLD
        )


def test_compatibility_distinguishes_energy_and_temperament():
    adopter = pd.Series(
        {
            "activity_level": "High",
            "home_type": "Apartment",
            "has_children": True,
            "has_other_pets": False,
            "other_pets_type": "NONE",
            "available_time": "High",
            "dog_experience": "Beginner",
        }
    )
    pet = pd.Series(
        {
            "energy_level": "High",
            "apartment_adaptability": "High",
            "children_compatibility": True,
            "exercise_need": "High",
            "temperament": "Calm",
        }
    )
    matching = _compatibility_score(adopter, pet)
    pet["energy_level"] = "Low"
    pet["temperament"] = "Territorial"
    assert matching == 1
    assert _compatibility_score(adopter, pet) == pytest.approx(4 / 6)
    assert _compatibility_score(adopter, pet) < COMPATIBILITY_THRESHOLD


def test_replace_cats_rejects_missing_pet_reference():
    pets = generate_pets(random.Random(42)).iloc[:5]
    with pytest.raises(ValueError, match="animais ausentes"):
        replace_cats(pets, pd.DataFrame({"pet_id": [9999]}), random.Random(42))


def test_current_catalog_and_pairs_are_consistent():
    pets = load_pets()
    pairs = load_compatibility_dataset()
    assert len(pets) == 1500
    assert set(pets["species"]) == {"Dog"}
    assert set(pets["type"]) == {"Canine"}
    assert pets["id"].is_unique
    assert set(pets["energy_level"]) == set(LEVELS)
    assert set(pets["temperament"]) == set(TEMPERAMENTS)
    assert len(pairs) == 750
    assert pairs["compatibility"].isin([0, 1]).all()
    assert not pairs.isna().any().any()
    assert not pairs.duplicated(["adopter_id", "pet_id"]).any()

    dogs = pets.set_index("id")
    feature_map = {
        "age": "pet_age",
        "energy_level": "pet_energy_level",
        "temperament": "pet_temperament",
        "sociability": "pet_sociability",
        "children_compatibility": "children_compatibility",
        "dogs_compatibility": "dogs_compatibility",
        "cats_compatibility": "cats_compatibility",
        "exercise_need": "exercise_need",
        "apartment_adaptability": "apartment_adaptability",
    }
    for _, pair in pairs.iterrows():
        pet = dogs.loc[pair["pet_id"]]
        assert all(pair[target] == pet[source] for source, target in feature_map.items())
        assert pair["compatibility"] == int(
            _compatibility_score(pair, pet) >= COMPATIBILITY_THRESHOLD
        )
