"""Carga e normaliza `real_pets.csv` (export do Google Forms do abrigo).

Colunas pessoais (e-mail, respons\u00e1vel, foto, n\u00famero do microchip) s\u00e3o descartadas
na leitura. O formul\u00e1rio ainda n\u00e3o tem as perguntas de energia, sociabilidade,
exerc\u00edcio etc. usadas pelo modelo, ent\u00e3o esses atributos N\u00c3O s\u00e3o inventados aqui.
"""

import pandas as pd

from ..config.settings import REAL_PETS_CSV

_COLUMNS = {
    "Data de Entrada": "entry_date",
    "Ra\u00e7a": "breed",
    "Sexo": "gender",
    "Microchipado": "microchipped",
    "Castrado": "neutered",
    "Tipo de Pelagem e Colora\u00e7\u00e3o": "coat_type",
    "Cor Predominante": "coat_color",
    "Data de Nascimento": "birth_date",
    "Porte": "size",
    "Perfil Comportamental Inicial": "behavior_profile",
    "Condi\u00e7\u00f5es Gerais de Sa\u00fade": "health_condition",
}

_SIZE = {"Pequeno": "Small", "M\u00e9dio": "Medium", "Grande": "Large"}


def load_real_pets(path=REAL_PETS_CSV) -> pd.DataFrame:
    raw = pd.read_csv(path, encoding="utf-8")
    raw.columns = [column.strip() for column in raw.columns]
    df = raw[list(_COLUMNS)].rename(columns=_COLUMNS).copy()

    for column in ("entry_date", "birth_date"):
        df[column] = pd.to_datetime(df[column], format="%m/%d/%Y", errors="coerce")
    df["age_years"] = ((pd.Timestamp.today() - df["birth_date"]).dt.days / 365.25).round(1)

    for column in ("microchipped", "neutered"):
        df[column] = df[column].str.strip().str.lower().map({"sim": True, "n\u00e3o": False})

    df["size"] = df["size"].str.split(" ").str[0].map(_SIZE)
    for column in ("breed", "gender", "coat_type", "coat_color", "behavior_profile", "health_condition"):
        df[column] = df[column].str.strip()

    df.insert(0, "id", range(1, len(df) + 1))
    return df


_LEVELS = ["Low", "Medium", "High"]


def _shift(level: str, delta: int) -> str:
    return _LEVELS[min(max(_LEVELS.index(level) + delta, 0), 2)]


def infer_ml_attributes(df: pd.DataFrame) -> pd.DataFrame:
    """Preenche por regra (suposição documentada) os atributos que o formulário não coleta.

    - energia/exercício: pela idade (<2 anos Alta, 2-7 Média, >7 Baixa); porte Grande sobe um nível.
    - temperamento: filhote -> Playful; "Dócil/Sociável" -> Affectionate; "Assustado/Acuado" -> Independent.
    - sociabilidade e compatibilidade com crianças/cães: Alta/True se dócil, Baixa/False se assustado.
    - gatos: sempre False (sem informação; escolha conservadora).
    - adaptação a apartamento: pelo porte (Pequeno Alta, Médio Média, Grande Baixa).
    """
    out = df.copy()
    docile = out["behavior_profile"].str.contains("cil", case=False, na=False)

    energy = out["age_years"].map(lambda a: "High" if a < 2 else "Medium" if a <= 7 else "Low")
    energy = [_shift(e, 1) if s == "Large" else e for e, s in zip(energy, out["size"])]

    out["species"] = "Dog"
    out["energy_level"] = energy
    out["exercise_need"] = energy
    out["temperament"] = ["Playful" if a < 1 else "Affectionate" if d else "Independent"
                          for a, d in zip(out["age_years"], docile)]
    out["sociability"] = docile.map({True: "High", False: "Low"})
    out["apartment_adaptability"] = out["size"].map({"Small": "High", "Medium": "Medium", "Large": "Low"})
    out["children_compatibility"] = docile
    out["dogs_compatibility"] = docile
    out["cats_compatibility"] = False
    out["attributes_source"] = "inferred"
    return out


def to_processed_pets(df: pd.DataFrame) -> pd.DataFrame:
    """Formato consumido pelo backend (import) e pelo modelo, sem dados pessoais."""
    import hashlib

    df = infer_ml_attributes(df)
    key = lambda r: hashlib.sha1(
        f"{r.entry_date:%Y-%m-%d}|{r.birth_date:%Y-%m-%d}|{r.breed}|{r.gender}|{r.coat_color}".encode()
    ).hexdigest()[:10]
    out = pd.DataFrame({
        "id": df["id"],
        "source_key": [key(r) for r in df.itertuples()],
        "name": "C\u00e3o " + df["id"].astype(str),
        "species": df["species"],
        "age": df["age_years"],
        "size": df["size"],
        "gender": df["gender"],
        "breed": df["breed"],
        "coat_type": df["coat_type"],
        "coat_color": df["coat_color"],
        "neutered": df["neutered"],
        "microchipped": df["microchipped"],
        "entry_date": df["entry_date"].dt.strftime("%Y-%m-%d"),
        "birth_date": df["birth_date"].dt.strftime("%Y-%m-%d"),
        "behavior_profile": df["behavior_profile"],
        "health_condition": df["health_condition"],
        "energy_level": df["energy_level"],
        "temperament": df["temperament"],
        "sociability": df["sociability"],
        "exercise_need": df["exercise_need"],
        "apartment_adaptability": df["apartment_adaptability"],
        "children_compatibility": df["children_compatibility"],
        "dogs_compatibility": df["dogs_compatibility"],
        "cats_compatibility": df["cats_compatibility"],
        "attributes_source": df["attributes_source"],
    })
    return out
