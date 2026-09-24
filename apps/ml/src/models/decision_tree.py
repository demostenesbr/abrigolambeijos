"""Candidato: Decision Tree.

Modelo mais interpretável entre os candidatos (a árvore pode ser
visualizada/explicada), mas mais propenso a overfitting do que o Random
Forest — por isso a profundidade é limitada (`max_depth`).
"""

from sklearn.tree import DecisionTreeClassifier


def build_decision_tree(random_state: int, max_depth: int = 6) -> DecisionTreeClassifier:
    return DecisionTreeClassifier(random_state=random_state, max_depth=max_depth)
