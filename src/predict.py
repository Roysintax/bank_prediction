import sys
from pathlib import Path
from typing import Any, Dict, Union

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import joblib
import pandas as pd

MODEL_PATH = Path("models/bank_marketing_model.pkl")
_MODEL_PIPELINE = None


def get_model():
    """Loads and caches the trained production model pipeline."""
    global _MODEL_PIPELINE
    if _MODEL_PIPELINE is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. Run 'python src/train.py' first."
            )
        _MODEL_PIPELINE = joblib.load(MODEL_PATH)
    return _MODEL_PIPELINE


def predict_customer(customer_data: Union[Dict[str, Any], pd.DataFrame]) -> Dict[str, Any]:
    """Predicts term deposit subscription for a customer.

    Args:
        customer_data: Dict or DataFrame with customer attributes.
            Expected features: age, job, marital, education, default, balance,
            housing, loan, contact, day, month, campaign, pdays, previous, poutcome.

    Returns:
        Dict with:
            - prediction: 'YES' or 'NO'
            - probability: float (0.0 to 1.0)
            - probability_pct: formatted string (e.g. '72.41%')
            - risk_tier: 'High Likelihood', 'Moderate Likelihood', or 'Low Likelihood'
    """
    model = get_model()

    if isinstance(customer_data, dict):
        df = pd.DataFrame([customer_data])
    else:
        df = customer_data.copy()

    # If duration was passed in, drop it to ensure leak-free evaluation
    # as the production model was trained without duration.
    # (The pipeline's ColumnTransformer drops unknown/remainder columns automatically).

    prob_positive = float(model.predict_proba(df)[0, 1])
    predicted_class = "YES" if prob_positive >= 0.50 else "NO"

    if prob_positive >= 0.65:
        tier = "High Likelihood"
    elif prob_positive >= 0.40:
        tier = "Moderate Likelihood"
    else:
        tier = "Low Likelihood"

    return {
        "prediction": predicted_class,
        "probability": prob_positive,
        "probability_pct": f"{prob_positive * 100:.2f}%",
        "risk_tier": tier,
    }


if __name__ == "__main__":
    sample_customer = {
        "age": 42,
        "job": "management",
        "marital": "married",
        "education": "tertiary",
        "default": "no",
        "balance": 2500,
        "housing": "no",
        "loan": "no",
        "contact": "cellular",
        "day": 15,
        "month": "may",
        "campaign": 1,
        "pdays": 999,
        "previous": 0,
        "poutcome": "unknown",
    }
    result = predict_customer(sample_customer)
    print("Sample Customer Prediction:")
    print(f"Prediction: {result['prediction']}")
    print(f"Subscription Probability: {result['probability_pct']} ({result['risk_tier']})")
