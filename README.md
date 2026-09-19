# bank_prediction

**Bank Marketing Subscription Prediction System**  
*Predicting Term Deposit Subscriptions using Logistic Regression, Decision Tree, and Random Forest*

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4%2B-orange.svg)](https://scikit-learn.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-App-red.svg)](https://streamlit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview
In direct bank marketing campaigns, outbound telemarketing phone calls represent a major operational expense and frequently cause customer call fatigue when untargeted. This project builds a production-ready, strictly leakage-free Machine Learning system that predicts whether a bank customer will subscribe to a term deposit (`y = 'yes' / 'no'`) using customer demographics, account balance indicators, and historical campaign touchpoints.

---

## 🎯 Main Research Questions
1. Can customer characteristics and previous campaign touchpoints accurately predict term deposit subscription?
2. Which customer features have the strongest relationship with subscription decisions?
3. How does class imbalance (88.3% "No" vs 11.7% "Yes") impact naive accuracy versus true recall?
4. What happens when the `duration` feature is removed to eliminate post-call target leakage?
5. How much does class weighting (`class_weight="balanced"`) improve minority-class detection?

---

## 📊 Dataset & Features
- **Dataset Source:** Hugging Face [`cestwc/bank-marketing`](https://huggingface.co/datasets/cestwc/bank-marketing)
- **Total Observations:** 45,211 rows × 17 columns
- **Target Distribution:**
  - `no`: 39,922 (88.30%)
  - `yes`: 5,289 (11.70%)
  - **Imbalance Ratio:** ~7.55 : 1

### Feature Dictionary
| Feature | Type | Description |
| :--- | :---: | :--- |
| `age` | Numerical | Age of the customer (18–95) |
| `job` | Categorical | Employment type (management, technician, blue-collar, etc.) |
| `marital` | Categorical | Marital status (married, single, divorced) |
| `education` | Categorical | Education level (tertiary, secondary, primary, unknown) |
| `default` | Categorical | Has credit in default? (yes, no) |
| `balance` | Numerical | Average annual balance in euros/dollars |
| `housing` | Categorical | Has housing loan / mortgage? (yes, no) |
| `loan` | Categorical | Has personal loan? (yes, no) |
| `contact` | Categorical | Contact communication type (cellular, telephone, unknown) |
| `month` | Categorical | Last contact month of year (jan–dec) |
| `day` | Numerical | Last contact day of the month (1–31) |
| `duration` | Numerical | Last contact duration in seconds (*excluded in production to prevent leakage*) |
| `campaign` | Numerical | Number of contacts performed during this campaign |
| `pdays` | Numerical | Days since customer was last contacted (999 = never) |
| `previous` | Numerical | Number of contacts performed before this campaign |
| `poutcome` | Categorical | Outcome of previous marketing campaign (success, failure, other, unknown) |
| **`y`** | **Target** | **Has the client subscribed a term deposit? (yes, no)** |

---

## ⚠️ Important Finding: The Duration Leakage Experiment
The `duration` feature records the conversation length of the phone call in seconds. 

| Model Configuration | Duration Used | Recall (Yes) | ROC-AUC | F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Random Forest (With Duration)** | Yes | 84.03% | 91.76% | 0.5575 | **Target Leakage (Artificial)** |
| **Random Forest (Without Duration)** | No | **60.40%** | **79.22%** | **0.4319** | **Production Ready (Leak-Free)** |

- **Why this is leakage:** Before a sales representative dials a prospect, call duration is 0 seconds (it cannot be known in advance). Training models with `duration` gives an artificial 90%+ performance that collapses in real-world deployment. The production model strictly omits `duration`.

---

## 🏆 Model Evaluation & Comparison
Evaluated on an unseen test set of 9,043 samples (stratified 20% split) without `duration`:

| Model Architecture | Accuracy | Precision (Yes) | Recall (Yes) | F1-Score | ROC-AUC | PR-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Balanced, Recommended)** | 81.41% | 33.61% | **60.40%** | **0.4319** | **79.22%** | **43.38%** |
| **Decision Tree (Balanced)** | 82.25% | 33.88% | 54.35% | 0.4174 | 74.46% | 34.19% |
| **Logistic Balanced** | 75.57% | 26.73% | 62.48% | 0.3744 | 77.22% | 40.94% |
| **Logistic Regression (Unweighted Baseline)** | **89.32%** | **66.31%** | 17.67% | 0.2791 | 77.17% | 41.10% |

> **Key Takeaway:** Unweighted Logistic Regression yields an impressive 89.32% accuracy, but misses **82.33%** of all potential subscribers! Balanced Random Forest boosts subscriber detection to **60.40% Recall**.

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Roysintax/bank_prediction.git
cd bank_prediction
```

### 2. Create virtual environment & install dependencies
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

---

## 💻 How to Run

### 1. Train the Models & Export Metrics
```bash
python src/train.py
```
*Trains all 4 models, executes the duration experiment, and saves the pipeline to `models/bank_marketing_model.pkl`.*

### 2. Launch the Streamlit Web Application
```bash
streamlit run app/app.py
```

### 3. Open the Standalone Web Dashboard
- Double-click or open `index.html` directly in any modern browser.
- If using XAMPP Apache, place in `htdocs` and visit `http://localhost/bank_prediction/`.

---

## 📁 Project Structure
```text
bank_prediction/
│
├── app/
│   └── app.py                      # Streamlit prediction web application
├── css/
│   └── style.css                   # Modern Fintech dark mode design system
├── data/
│   ├── raw/
│   └── processed/
├── js/
│   ├── app.js                      # Interactive dashboard logic & simulator engine
│   └── data.js                     # Pre-packaged model metrics & feature importances
├── models/
│   └── bank_marketing_model.pkl    # Serialized scikit-learn production pipeline
├── notebooks/
│   └── 01_data_understanding.ipynb # Phase 1 exploratory data analysis notebook
├── prompt/
│   ├── prompt.md                   # Complete specification prompt
│   └── website.md                  # Detailed website design prompt
├── reports/
│   ├── model_metrics.json          # Full JSON metrics & threshold analysis
│   └── model_results.csv           # Model comparison table
├── src/
│   ├── __init__.py
│   ├── data_loader.py              # Hugging Face dataset fetcher & ClassLabel decoder
│   ├── preprocessing.py            # ColumnTransformer (StandardScaler + OneHotEncoder)
│   ├── train.py                    # Training pipeline & evaluation
│   └── predict.py                  # Standalone prediction service
├── index.html                      # Standalone interactive web dashboard
├── requirements.txt                # Core Python dependencies
├── README.md                       # Documentation
└── .gitignore                      # Git ignore rules
```

---

## ⚖️ Ethical Considerations & Limitations
- **Decision Support, Not Exclusion:** This system is intended for outbound call prioritization to optimize marketing budgets, not for denying financial services.
- **Historical Data Bias:** Demographic categories reflect past promotional outcomes and should be reviewed periodically to avoid feedback loops.
- **Correlation ≠ Causation:** High feature importance indicates predictive association, not direct behavioral causation.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
