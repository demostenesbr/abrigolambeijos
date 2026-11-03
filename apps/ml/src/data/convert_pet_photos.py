"""Converte as fotos originais dos pets (JPG, PNG, HEIC) para WEBP com nome em hash.

Uso: python -m src.data.convert_pet_photos (dentro de apps/ml)

Gera tamb\u00e9m `datasets/processed/photo_map.json` (ID do Google Drive -> arquivo WEBP). Os nomes dos
arquivos originais (que identificam o respons\u00e1vel) n\u00e3o s\u00e3o gravados no mapa.
"""

import hashlib
import io
import json
import re
from pathlib import Path

import pandas as pd
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

from ..config.settings import ML_ROOT, REAL_PETS_CSV

register_heif_opener()

PETS_ASSETS = ML_ROOT.parent / "admin" / "src" / "assets" / "pets"
ORIGINAL_DIR = PETS_ASSETS / "original"
WEBP_DIR = PETS_ASSETS / "WEBP"
MAP_PATH = ML_ROOT / "datasets" / "processed" / "photo_map.json"

MAX_SIDE = 1600
QUALITY = 82
# Mesma planilha do formul\u00e1rio: ID do Drive -> nome do arquivo original (sem extens\u00e3o)
SOURCE_SUFFIX = " - Meyre Morley"
DRIVE_ID_PATTERN = re.compile(r"id=([\w-]+)")


def to_webp_bytes(path: Path) -> bytes:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((MAX_SIDE, MAX_SIDE))
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        buffer = io.BytesIO()
        image.save(buffer, "WEBP", quality=QUALITY, method=6)
    return buffer.getvalue()


def convert_all(drive_to_original: dict[str, str]) -> dict[str, str]:
    WEBP_DIR.mkdir(parents=True, exist_ok=True)
    by_stem = {p.name.removesuffix(p.suffix).removesuffix(SOURCE_SUFFIX): p for p in ORIGINAL_DIR.iterdir() if p.is_file()}
    mapping: dict[str, str] = {}
    for drive_id, stem in drive_to_original.items():
        source = by_stem[stem]
        data = to_webp_bytes(source)
        name = hashlib.sha256(data).hexdigest()[:16] + ".webp"
        (WEBP_DIR / name).write_bytes(data)
        mapping[drive_id] = name
        print(f"{source.suffix.lower():6} {len(data) / 1024:7.1f} KB -> {name}")
    return mapping


def main() -> None:
    raw = pd.read_csv(REAL_PETS_CSV, encoding="utf-8")
    drive_ids = [DRIVE_ID_PATTERN.search(url).group(1) for url in raw["Foto do Pet"]]
    table = json.loads((Path(__file__).with_name("photo_sources.json")).read_text(encoding="utf-8"))
    missing = [drive_id for drive_id in drive_ids if drive_id not in table]
    if missing:
        raise SystemExit(f"Sem arquivo original para: {missing}")
    mapping = convert_all({drive_id: table[drive_id] for drive_id in drive_ids})
    MAP_PATH.write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    print(f"{len(mapping)} fotos -> {WEBP_DIR}")


if __name__ == "__main__":
    main()
