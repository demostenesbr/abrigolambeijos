"""CLI para o backend Node chamar o pipeline de recomendação via subprocess.

Lê um payload JSON da stdin: {"profile": {...campos do adotante...}, "top_n": N}
Escreve na stdout um JSON: [{"pet_id": int, "name": str, "species": str,
"compatibility_score": float}, ...]

Uso:
    apps/ml/.venv/Scripts/python.exe -m src.interference.cli
"""

import json
import sys

from ..data.loader import load_pets
from .recommender import recommend_pets


def main() -> None:
    payload = json.loads(sys.stdin.read())
    profile = payload["profile"]
    top_n = payload.get("top_n", 5)

    pets = load_pets()
    ranked = recommend_pets(profile, pets, top_n=top_n)

    result = ranked[["id", "name", "species", "compatibility_score"]].rename(
        columns={"id": "pet_id"}
    )
    print(result.to_json(orient="records"))


if __name__ == "__main__":
    main()
