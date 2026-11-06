"""Gera datasets sintéticos para o módulo de recomendação de ML.

Corrige o `pets.csv` corrompido (continha strings de erro de um gerador
quebrado, ex: "error: undefined method `first' for nil:NilClass") e cria o
`compatibility_dataset.csv`, que antes não existia.

IMPORTANTE — metodologia do rótulo `compatibility` (0/1):
    O rótulo NÃO é sorteado aleatoriamente. Ele é calculado por uma regra
    determinística e documentada (`_compatibility_score`) que soma pontos de
    compatibilidade entre o perfil do adotante e o perfil do pet em 6
    critérios (energia/atividade, adequação ao lar, crianças, outros animais,
    tempo disponível x necessidade de exercício, experiência x temperamento).
    Um par é rotulado como compatível (1) quando atinge pelo menos
    `COMPATIBILITY_THRESHOLD` dos critérios. Isso é uma heurística de partida
    (não uma avaliação de especialista nem dados reais de adoção) e deve ser
    tratada como tal — está documentada aqui exatamente para não ser
    confundida com uma fonte de verdade real.

Uso:
    apps/ml/.venv/Scripts/python.exe apps/ml/src/data/generate_datasets.py
"""

from __future__ import annotations

import argparse
import random
from pathlib import Path

import pandas as pd

SEED = 42
NUM_PETS = 1500
NUM_ADOPTERS = 150
PAIRS_PER_ADOPTER = 5
COMPATIBILITY_THRESHOLD = 0.7  # >=70% dos critérios batendo = compatível

RAW_DIR = Path(__file__).resolve().parents[2] / "datasets" / "raw"

DOG_BREEDS = ["Labrador", "Vira-lata", "Poodle", "Bulldog", "Shih Tzu", "Border Collie"]
CITIES = ["São Paulo, SP", "Rio de Janeiro, RJ", "Curitiba, PR", "Belo Horizonte, MG"]
LEVELS = ["Low", "Medium", "High"]
TEMPERAMENTS = ["Calm", "Playful", "Independent", "Affectionate", "Territorial"]


def _bool(rng: random.Random, p_true: float = 0.5) -> bool:
    return rng.random() < p_true


def generate_dog(pet_id: int, rng: random.Random) -> dict:
    size = rng.choice(["Small", "Medium", "Large"])
    energy_level = rng.choice(LEVELS)
    temperament = rng.choice(TEMPERAMENTS)
    return {
        "id": pet_id,
        "name": f"Pet{pet_id}",
        "species": "Dog",
        "age": round(rng.uniform(0.3, 14.0), 1),
        "size": size,
        "type": "Canine",
        "breed": rng.choice(DOG_BREEDS),
        "gender": rng.choice(["Male", "Female"]),
        "location": rng.choice(CITIES),
        "energy_level": energy_level,
        "temperament": temperament,
        "sociability": rng.choice(LEVELS),
        "children_compatibility": _bool(rng, 0.65),
        "dogs_compatibility": _bool(rng, 0.6),
        "cats_compatibility": _bool(rng, 0.55),
        "exercise_need": energy_level,
        "special_needs": _bool(rng, 0.1),
        "vaccinated": _bool(rng, 0.85),
        "neutered": _bool(rng, 0.7),
        "trained": _bool(rng, 0.4),
        "apartment_adaptability": rng.choice(LEVELS),
        "description": f"Dog de porte {size.lower()}, temperamento {temperament.lower()}.",
    }


def generate_pets(rng: random.Random) -> pd.DataFrame:
    return pd.DataFrame(generate_dog(pet_id, rng) for pet_id in range(1, NUM_PETS + 1))


def generate_adopters(rng: random.Random) -> pd.DataFrame:
    rows = []
    for adopter_id in range(1, NUM_ADOPTERS + 1):
        has_children = _bool(rng, 0.4)
        has_other_pets = _bool(rng, 0.35)
        rows.append(
            {
                "adopter_id": adopter_id,
                "home_type": rng.choice(["Apartment", "House"]),
                "has_yard": _bool(rng, 0.4),
                "has_children": has_children,
                "children_age_group": (
                    rng.choice(["CHILDREN_0_5", "CHILDREN_6_12", "CHILDREN_13_17"])
                    if has_children
                    else "NOT_APPLICABLE"
                ),
                "has_other_pets": has_other_pets,
                "other_pets_type": rng.choice(["DOG", "CAT"]) if has_other_pets else "NONE",
                "dog_experience": rng.choice(["Beginner", "Intermediate", "Experienced"]),
                "available_time": rng.choice(LEVELS),
                "activity_level": rng.choice(LEVELS),
                "preferred_size": rng.choice(["Small", "Medium", "Large"]),
                "preferred_age": rng.choice(["Filhote", "Adulto", "Idoso"]),
            }
        )
    return pd.DataFrame(rows)


def _compatibility_score(adopter: pd.Series, pet: pd.Series) -> float:
    """Retorna a fração de critérios de compatibilidade atendidos (0.0 a 1.0)."""
    criteria = []

    # 1. Energia do pet compatível com o nível de atividade do adotante
    criteria.append(adopter["activity_level"] == pet["energy_level"])

    # 2. Apartamento exige adaptabilidade Media/Alta
    if adopter["home_type"] == "Apartment":
        criteria.append(pet["apartment_adaptability"] != "Low")
    else:
        criteria.append(True)

    # 3. Adotante com crianças exige pet compatível com crianças
    criteria.append(not adopter["has_children"] or bool(pet["children_compatibility"]))

    # 4. Adotante com outros animais exige compatibilidade com o tipo correspondente
    if adopter["has_other_pets"] and adopter["other_pets_type"] == "DOG":
        criteria.append(bool(pet["dogs_compatibility"]))
    elif adopter["has_other_pets"] and adopter["other_pets_type"] == "CAT":
        criteria.append(bool(pet["cats_compatibility"]))
    else:
        criteria.append(True)

    # 5. Tempo disponível deve cobrir a necessidade de exercício do pet
    time_rank = {"Low": 0, "Medium": 1, "High": 2}
    criteria.append(time_rank[adopter["available_time"]] >= time_rank[pet["exercise_need"]])

    # 6. Experiência do adotante compatível com temperamentos mais desafiadores
    if pet["temperament"] in ("Territorial", "Independent"):
        criteria.append(adopter["dog_experience"] in ("Intermediate", "Experienced"))
    else:
        criteria.append(True)

    return sum(criteria) / len(criteria)


def generate_compatibility_dataset(
    adopters: pd.DataFrame, pets: pd.DataFrame, rng: random.Random
) -> pd.DataFrame:
    rows = []
    pet_ids = pets["id"].tolist()

    for _, adopter in adopters.iterrows():
        sampled_pet_ids = rng.sample(pet_ids, k=PAIRS_PER_ADOPTER)
        for pet_id in sampled_pet_ids:
            pet = pets.loc[pets["id"] == pet_id].iloc[0]
            score = _compatibility_score(adopter, pet)
            rows.append(
                {
                    "adopter_id": adopter["adopter_id"],
                    "pet_id": pet_id,
                    "home_type": adopter["home_type"],
                    "has_yard": adopter["has_yard"],
                    "has_children": adopter["has_children"],
                    "children_age_group": adopter["children_age_group"],
                    "has_other_pets": adopter["has_other_pets"],
                    "other_pets_type": adopter["other_pets_type"],
                    "dog_experience": adopter["dog_experience"],
                    "available_time": adopter["available_time"],
                    "activity_level": adopter["activity_level"],
                    "preferred_size": adopter["preferred_size"],
                    "preferred_age": adopter["preferred_age"],
                    "pet_age": pet["age"],
                    "pet_energy_level": pet["energy_level"],
                    "pet_temperament": pet["temperament"],
                    "pet_sociability": pet["sociability"],
                    "children_compatibility": pet["children_compatibility"],
                    "dogs_compatibility": pet["dogs_compatibility"],
                    "cats_compatibility": pet["cats_compatibility"],
                    "exercise_need": pet["exercise_need"],
                    "apartment_adaptability": pet["apartment_adaptability"],
                    "compatibility": int(score >= COMPATIBILITY_THRESHOLD),
                }
            )
    return pd.DataFrame(rows)


def replace_cats(
    pets: pd.DataFrame, compatibility: pd.DataFrame, rng: random.Random
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Substitui gatos por cães e recalcula apenas os pares afetados."""
    if pets["id"].duplicated().any() or not pets["species"].isin(["Dog", "Cat"]).all():
        raise ValueError("Catálogo contém IDs duplicados ou espécies inesperadas.")
    if not compatibility["pet_id"].isin(pets["id"]).all():
        raise ValueError("Há pares que referenciam animais ausentes do catálogo.")

    updated_pets = pets.copy()
    updated_pairs = compatibility.copy()
    cat_mask = updated_pets["species"] == "Cat"
    cat_ids = updated_pets.loc[cat_mask, "id"].tolist()
    replacements = pd.DataFrame([generate_dog(int(pet_id), rng) for pet_id in cat_ids])
    if not cat_ids:
        return updated_pets, updated_pairs
    updated_pets.loc[cat_mask, replacements.columns] = replacements.to_numpy()
    dogs_by_id = updated_pets.set_index("id")
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
    for index in updated_pairs.index[updated_pairs["pet_id"].isin(cat_ids)]:
        pet = dogs_by_id.loc[updated_pairs.at[index, "pet_id"]]
        for source, target in feature_map.items():
            updated_pairs.at[index, target] = pet[source]
        updated_pairs.at[index, "compatibility"] = int(
            _compatibility_score(updated_pairs.loc[index], pet) >= COMPATIBILITY_THRESHOLD
        )
    return updated_pets, updated_pairs


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--replace-cats",
        action="store_true",
        help="Substitui apenas gatos no catálogo existente e atualiza os pares afetados.",
    )
    args = parser.parse_args()
    rng = random.Random(SEED)
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    pets_path = RAW_DIR / "pets.csv"
    compat_path = RAW_DIR / "compatibility_dataset.csv"
    if args.replace_cats:
        pets = pd.read_csv(pets_path)
        compatibility = pd.read_csv(compat_path)
        count = int((pets["species"] == "Cat").sum())
        pets, compatibility = replace_cats(pets, compatibility, rng)
        print(f"Gatos substituídos por cães: {count}")
    else:
        pets = generate_pets(rng)
        adopters = generate_adopters(rng)
        compatibility = generate_compatibility_dataset(adopters, pets, rng)
    pets.to_csv(pets_path, index=False)
    print(f"pets.csv gerado: {len(pets)} linhas -> {pets_path}")
    compatibility.to_csv(compat_path, index=False)
    positive_rate = compatibility["compatibility"].mean()
    print(
        f"compatibility_dataset.csv gerado: {len(compatibility)} linhas -> {compat_path} "
        f"(taxa de positivos: {positive_rate:.1%})"
    )


if __name__ == "__main__":
    main()
