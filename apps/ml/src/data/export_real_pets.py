"""Gera datasets/processed/pets_processed.csv a partir de real_pets.csv.

Uso: python -m src.data.export_real_pets (dentro de apps/ml)
"""

from ..config.settings import PROCESSED_DIR
from .real_pets import load_real_pets, to_processed_pets

OUTPUT = PROCESSED_DIR / "pets_processed.csv"


def main() -> None:
    processed = to_processed_pets(load_real_pets())
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    processed.to_csv(OUTPUT, index=False, encoding="utf-8")
    print(f"{len(processed)} pets -> {OUTPUT}")


if __name__ == "__main__":
    main()
