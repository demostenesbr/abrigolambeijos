"""Comparação de modelos candidatos via validação cruzada."""

from sklearn.model_selection import StratifiedGroupKFold, StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline

from ..config.settings import CV_FOLDS, RANDOM_STATE


def cross_validate_pipeline(pipeline: Pipeline, X, y, groups=None) -> dict:
    # Com `groups`, um mesmo adotante nunca aparece em treino e validação ao mesmo tempo
    if groups is None:
        cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    else:
        cv = StratifiedGroupKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(pipeline, X, y, cv=cv, scoring="f1", groups=groups)
    return {
        "f1_mean": float(scores.mean()),
        "f1_std": float(scores.std()),
        "folds": scores.tolist(),
    }
