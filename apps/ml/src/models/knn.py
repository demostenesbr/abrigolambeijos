"""Candidato: K-Nearest Neighbors.

Sem fase de "treino" real (lazy learner); classifica pela maioria dos
`n_neighbors` pares adotante-pet mais parecidos no espaço de features já
pré-processado pelo ColumnTransformer.
"""

from sklearn.neighbors import KNeighborsClassifier


def build_knn(n_neighbors: int = 7) -> KNeighborsClassifier:
    return KNeighborsClassifier(n_neighbors=n_neighbors)
