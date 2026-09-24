"""Persistência de relatórios de avaliação em JSON."""

import json
from pathlib import Path


def save_json_report(data: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
