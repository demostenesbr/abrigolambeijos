"""Candidato: Logistic Regression.

Baseline linear — rápido de treinar e fácil de explicar (pesos por feature),
usado aqui principalmente como referência de comparação para os modelos
não-lineares (Decision Tree, Random Forest, KNN).
"""

from sklearn.linear_model import LogisticRegression


def build_logistic_regression(random_state: int, max_iter: int = 1000) -> LogisticRegression:
    return LogisticRegression(max_iter=max_iter, random_state=random_state)
