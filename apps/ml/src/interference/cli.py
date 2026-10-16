"""CLI para o backend Node chamar o pipeline de recomendação via subprocess.

Lê um payload JSON da stdin: {"profile": {...campos do adotante...}, "top_n": N}
Escreve na stdout um JSON: [{"pet_id": int, "name": str, "species": str,
"compatibility_score": float}, ...]

Uso:
    apps/ml/.venv/Scripts/python.exe -m src.interference.cli
"""

import json
import sys

import pandas as pd

from ..data.loader import load_pets
from .predictor import InvalidFeaturesError
from .recommender import recommend_pets


def main() -> None:
    payload = json.loads(sys.stdin.read())
    profile = payload["profile"]
    top_n = payload.get("top_n", 5)

    # `pets` opcional (formato de pets.csv); sem ele usa o catálogo sintético
    pets = pd.DataFrame(payload["pets"]) if payload.get("pets") else load_pets()
    try:
        ranked = recommend_pets(profile, pets, top_n=top_n)
    except InvalidFeaturesError as error:
        print(f"Entrada inválida: {error}", file=sys.stderr)
        sys.exit(2)

    result = ranked[["id", "name", "species", "compatibility_score"]].rename(
        columns={"id": "pet_id"}
    )
    print(result.to_json(orient="records"))


if __name__ == "__main__":
    main()
