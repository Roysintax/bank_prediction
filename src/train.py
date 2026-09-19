"""Model training, evaluation, leakage experimentation, and artifact export for Bank Marketing."""

import json
from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data_loader import load_bank_marketing_data
from src.preprocessing import create_preprocessor


def evaluate_model(pipeline: Pipeline, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
    """Calculates comprehensive classification metrics on unseen test data."""
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else None

    cm = confusion_matrix(y_test, y_pred)
    # cm: [[TN, FP], [FN, TP]]
    tn, fp, fn, tp = cm.ravel()

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, y_prob)) if y_prob is not None else None,
        "pr_auc": float(average_precision_score(y_test, y_prob)) if y_prob is not None else None,
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
        },
    }
    return metrics


def run_training_pipeline() -> Dict[str, Any]:
    """Executes full ML training workflow, evaluates models, runs duration experiment,

    and saves model artifacts.
    """
    print("Loading Bank Marketing dataset...")
    df = load_bank_marketing_data(use_cache=True)

    # Encode binary target: 'yes' -> 1, 'no' -> 0
    y = (df["y"] == "yes").astype(int)
    X = df.drop(columns=["y"])

    # 80/20 Stratified train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training split: {X_train.shape[0]} samples | Testing split: {X_test.shape[0]} samples")

    # 1. Train Production Models (WITHOUT 'duration' to prevent target leakage)
    preprocessor_prod, num_cols_prod, cat_cols_prod = create_preprocessor(include_duration=False)

    models_to_train = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Logistic Balanced": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, class_weight="balanced", random_state=42),
        "Random Forest": RandomForestClassifier(
            n_estimators=100, max_depth=10, class_weight="balanced", random_state=42, n_jobs=-1
        ),
    }

    results_list: List[Dict[str, Any]] = []
    trained_pipelines: Dict[str, Pipeline] = {}

    for name, clf in models_to_train.items():
        print(f"Training {name} (Leak-free: without duration)...")
        pipe = Pipeline(steps=[("preprocessor", preprocessor_prod), ("classifier", clf)])
        pipe.fit(X_train, y_train)
        trained_pipelines[name] = pipe

        metrics = evaluate_model(pipe, X_test, y_test)
        results_list.append({
            "model": name,
            "duration_used": False,
            **metrics,
        })

    # 2. Duration Experiment (WITH 'duration')
    preprocessor_with_dur, _, _ = create_preprocessor(include_duration=True)
    leakage_models = {
        "Logistic Regression (With Duration)": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest (With Duration)": RandomForestClassifier(
            n_estimators=100, max_depth=10, class_weight="balanced", random_state=42, n_jobs=-1
        ),
    }

    for name, clf in leakage_models.items():
        print(f"Training {name} (With duration for experiment)...")
        pipe = Pipeline(steps=[("preprocessor", preprocessor_with_dur), ("classifier", clf)])
        pipe.fit(X_train, y_train)
        metrics = evaluate_model(pipe, X_test, y_test)
        results_list.append({
            "model": name,
            "duration_used": True,
            **metrics,
        })

    # 3. Extract Feature Importances from Production Random Forest
    rf_pipe = trained_pipelines["Random Forest"]
    rf_clf: RandomForestClassifier = rf_pipe.named_steps["classifier"]
    ohe: Any = rf_pipe.named_steps["preprocessor"].named_transformers_["cat"]
    encoded_cat_names = list(ohe.get_feature_names_out(cat_cols_prod))
    all_feature_names = num_cols_prod + encoded_cat_names

    importances = rf_clf.feature_importances_
    feat_imp = sorted(
        [{"feature": f, "importance": float(imp)} for f, imp in zip(all_feature_names, importances)],
        key=lambda x: x["importance"],
        reverse=True,
    )

    # 4. Extract Logistic Regression Coefficients
    log_pipe = trained_pipelines["Logistic Balanced"]
    log_clf: LogisticRegression = log_pipe.named_steps["classifier"]
    coefs = log_clf.coef_[0]
    feat_coefs = sorted(
        [{"feature": f, "coefficient": float(c)} for f, c in zip(all_feature_names, coefs)],
        key=lambda x: abs(x["coefficient"]),
        reverse=True,
    )

    # 5. Threshold Analysis for Production Random Forest
    rf_probs = rf_pipe.predict_proba(X_test)[:, 1]
    threshold_results = []
    for thresh in [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80]:
        preds = (rf_probs >= thresh).astype(int)
        threshold_results.append({
            "threshold": thresh,
            "precision": float(precision_score(y_test, preds, zero_division=0)),
            "recall": float(recall_score(y_test, preds, zero_division=0)),
            "f1": float(f1_score(y_test, preds, zero_division=0)),
            "predicted_positives": int(preds.sum()),
        })

    # 6. Save Artifacts
    models_dir = Path("models")
    reports_dir = Path("reports")
    models_dir.mkdir(exist_ok=True)
    reports_dir.mkdir(exist_ok=True)

    # Save final production pipeline (Random Forest without duration)
    best_pipe = rf_pipe
    model_save_path = models_dir / "bank_marketing_model.pkl"
    joblib.dump(best_pipe, model_save_path)
    print(f"Saved production model pipeline to {model_save_path}")

    # Export results table as CSV
    results_df = pd.DataFrame(results_list)
    results_csv_path = reports_dir / "model_results.csv"
    results_df.to_csv(results_csv_path, index=False)
    print(f"Saved model comparison table to {results_csv_path}")

    # Export comprehensive JSON metrics for the web dashboard
    full_metrics = {
        "models": results_list,
        "feature_importances": feat_imp[:20],
        "top_coefficients": feat_coefs[:20],
        "threshold_analysis": threshold_results,
        "summary": {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "class_0_no": int((y == 0).sum()),
            "class_1_yes": int((y == 1).sum()),
            "imbalance_ratio": f"{((y == 0).sum() / (y == 1).sum()):.2f}:1",
            "recommended_model": "Random Forest (Balanced, Leak-Free)",
        },
    }

    metrics_json_path = reports_dir / "model_metrics.json"
    with open(metrics_json_path, "w") as f:
        json.dump(full_metrics, f, indent=2)
    print(f"Saved metrics JSON to {metrics_json_path}")

    return full_metrics


if __name__ == "__main__":
    run_training_pipeline()
