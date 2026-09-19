"""Data preprocessing pipeline definitions for Bank Marketing dataset."""

from typing import List, Tuple
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Default feature definitions
ALL_NUMERICAL_FEATURES: List[str] = [
    "age",
    "balance",
    "day",
    "duration",
    "campaign",
    "pdays",
    "previous",
]

# Features excluding 'duration' to prevent target leakage in pre-call marketing models
LEAK_FREE_NUMERICAL_FEATURES: List[str] = [
    "age",
    "balance",
    "day",
    "campaign",
    "pdays",
    "previous",
]

CATEGORICAL_FEATURES: List[str] = [
    "job",
    "marital",
    "education",
    "default",
    "housing",
    "loan",
    "contact",
    "month",
    "poutcome",
]


def create_preprocessor(include_duration: bool = False) -> Tuple[ColumnTransformer, List[str], List[str]]:
    """Builds a scikit-learn ColumnTransformer that scales numerical features

    and one-hot encodes categorical features without data leakage.

    Args:
        include_duration: If True, includes 'duration' in numerical features.
                          If False (recommended for production), excludes 'duration'.

    Returns:
        Tuple containing:
            - ColumnTransformer instance
            - List of numerical feature names used
            - List of categorical feature names used
    """
    num_features = ALL_NUMERICAL_FEATURES if include_duration else LEAK_FREE_NUMERICAL_FEATURES
    cat_features = CATEGORICAL_FEATURES.copy()

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                StandardScaler(),
                num_features,
            ),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                cat_features,
            ),
        ],
        remainder="drop",
    )

    return preprocessor, num_features, cat_features
