"""Carregamento dos datasets brutos em DataFrames pandas."""

import pandas as pd

from ..config.settings import COMPATIBILITY_CSV, PETS_CSV


def load_pets() -> pd.DataFrame:
    return pd.read_csv(PETS_CSV)


def load_compatibility_dataset() -> pd.DataFrame:
    return pd.read_csv(COMPATIBILITY_CSV)
