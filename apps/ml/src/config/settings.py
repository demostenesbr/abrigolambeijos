"""Configurações centrais do pipeline de ML (caminhos e definição de features).

Mantém em um único lugar a lista de colunas usadas como feature, para que
feature engineering, treino, avaliação e inferência nunca fiquem
dessincronizados entre si.
"""

from pathlib import Path

ML_ROOT = Path(__file__).resolve().parents[2]

RAW_DIR = ML_ROOT / "datasets" / "raw"
PROCESSED_DIR = ML_ROOT / "datasets" / "processed"
MODEL_DIR = ML_ROOT / "models" / "animal-recommender"
REPORTS_DIR = ML_ROOT / "artfacts" / "reports"

PETS_CSV = RAW_DIR / "pets.csv"
COMPATIBILITY_CSV = RAW_DIR / "compatibility_dataset.csv"

MODEL_PATH = MODEL_DIR / "model.joblib"
MODEL_METADATA_PATH = MODEL_DIR / "metadata.json"
EVALUATION_REPORT_PATH = REPORTS_DIR / "evaluation-report.json"
METRICS_PATH = REPORTS_DIR / "metrics.json"

TARGET_COLUMN = "compatibility"
ID_COLUMNS = ["adopter_id", "pet_id"]

# Ordem crescente de intensidade — usada por um OrdinalEncoder
ORDINAL_LEVELS = ["Low", "Medium", "High"]
DOG_EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Experienced"]

ORDINAL_COLUMNS = {
    "available_time": ORDINAL_LEVELS,
    "activity_level": ORDINAL_LEVELS,
    "pet_energy_level": ORDINAL_LEVELS,
    "pet_sociability": ORDINAL_LEVELS,
    "exercise_need": ORDINAL_LEVELS,
    "apartment_adaptability": ORDINAL_LEVELS,
    "dog_experience": DOG_EXPERIENCE_LEVELS,
}

NOMINAL_COLUMNS = [
    "home_type",
    "children_age_group",
    "other_pets_type",
    "preferred_size",
    "preferred_age",
    "pet_temperament",
]

BOOLEAN_COLUMNS = [
    "has_yard",
    "has_children",
    "has_other_pets",
    "children_compatibility",
    "dogs_compatibility",
    "cats_compatibility",
]

NUMERIC_COLUMNS = ["pet_age"]

FEATURE_COLUMNS = (
    list(ORDINAL_COLUMNS.keys()) + NOMINAL_COLUMNS + BOOLEAN_COLUMNS + NUMERIC_COLUMNS
)

RANDOM_STATE = 42
TEST_SIZE = 0.2
CV_FOLDS = 5
