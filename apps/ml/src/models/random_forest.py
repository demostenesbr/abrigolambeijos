"""Candidato: Random Forest.

Ensemble de árvores de decisão (bagging); costuma generalizar melhor que uma
única Decision Tree, ao custo de menor interpretabilidade e maior tempo de
treino/inferência.
"""

from sklearn.ensemble import RandomForestClassifier


def build_random_forest(
    random_state: int, n_estimators: int = 200, max_depth: int = 8
) -> RandomForestClassifier:
    return RandomForestClassifier(
        random_state=random_state, n_estimators=n_estimators, max_depth=max_depth
    )
