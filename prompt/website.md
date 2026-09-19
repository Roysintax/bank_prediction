# MACHINE LEARNING PROJECT PROMPT

## Project Title

**Bank Marketing Subscription Prediction Using Logistic Regression, Decision Tree, and Random Forest**

---

## 1. Role

Act as a:

- Senior Machine Learning Engineer
- Data Scientist
- Python Developer
- Data Analyst
- Machine Learning Mentor
- Clean Code Reviewer

Your task is to build this project step by step in a way that is suitable for a beginner who is learning Machine Learning.

Do not only generate code.

Every important step must be:

1. explained,
2. implemented,
3. evaluated,
4. documented,
5. and written using clean and readable Python code.

The project must remain lightweight enough to run comfortably on a normal personal computer.

Do not use Deep Learning.

---

# 2. Project Objective

Build a Machine Learning system capable of predicting whether a bank customer will subscribe to a term deposit based on customer characteristics and previous marketing campaign information.

The prediction target is:

```text
y
```

Possible target values:

```text
yes
no
```

The project is a:

```text
Binary Classification Problem
```

Final prediction:

```text
YES → Customer is predicted to subscribe
NO  → Customer is predicted not to subscribe
```

---

# 3. Dataset

Use the Hugging Face dataset:

```python
from datasets import load_dataset

ds = load_dataset("cestwc/bank-marketing")
```

Dataset source:

```text
cestwc/bank-marketing
```

Convert the Hugging Face dataset to Pandas before continuing the analysis.

Example:

```python
df = ds["train"].to_pandas()
```

Do not replace the dataset unless there is a technical problem that makes the original dataset unusable.

---

# 4. Expected Dataset Features

The dataset contains approximately the following features:

```text
age
job
marital
education
default
balance
housing
loan
contact
day
month
duration
campaign
pdays
previous
poutcome
y
```

Target:

```text
y
```

Input features:

```text
X = all columns except y
```

Target:

```text
y = y
```

---

# 5. Main Research Question

The main question of the project is:

> Can customer characteristics and marketing campaign information be used to predict whether a customer will subscribe to a bank term deposit?

Additional questions:

1. Which features have the strongest relationship with subscription decisions?
2. How well can Logistic Regression predict customer subscription?
3. Does Decision Tree improve the prediction?
4. Does Random Forest improve the prediction?
5. How does class imbalance affect model performance?
6. What happens to prediction performance when the `duration` feature is removed?
7. Which features contribute most strongly to prediction?
8. How much does class weighting improve minority-class detection?

---

# 6. Important Machine Learning Problem

The dataset has an imbalanced target distribution.

The number of customers that do not subscribe is significantly larger than customers that subscribe.

Therefore:

DO NOT evaluate the model using Accuracy alone.

The project must evaluate:

```text
Accuracy
Precision
Recall
F1-Score
Confusion Matrix
ROC-AUC
PR-AUC
```

Pay special attention to:

```text
Recall for YES
Precision for YES
F1-score for YES
```

---

# 7. Important Feature Leakage Investigation

The feature:

```text
duration
```

represents the duration of the last customer contact.

This feature may not be available before the marketing call happens.

Therefore create two experiments.

## Experiment A

Train the model using:

```text
duration
```

## Experiment B

Train the model without:

```text
duration
```

Compare both experiments.

Evaluate whether using `duration` produces unrealistically high predictive performance.

Explain clearly why this may cause a prediction-time information leakage problem.

Do not automatically call something leakage without explaining why.

---

# 8. Development Method

Use a structured Machine Learning workflow.

Follow this exact development order.

```text
1. Environment Setup
2. Dataset Loading
3. Dataset Understanding
4. Data Quality Inspection
5. Data Cleaning
6. Exploratory Data Analysis
7. Feature Analysis
8. Target Analysis
9. Train-Test Split
10. Data Preprocessing
11. Baseline Model
12. Logistic Regression
13. Model Evaluation
14. Class Imbalance Handling
15. Decision Tree
16. Random Forest
17. Model Comparison
18. Feature Importance
19. Duration Leakage Experiment
20. Error Analysis
21. Model Selection
22. Save Model
23. Prediction Function
24. Streamlit Application
25. Documentation
```

Do not skip steps.

---

# 9. Project Folder Structure

Create the project using a clean folder structure.

Recommended structure:

```text
bank-marketing-ml/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_data_cleaning.ipynb
│   ├── 03_eda.ipynb
│   ├── 04_logistic_regression.ipynb
│   ├── 05_tree_models.ipynb
│   └── 06_model_comparison.ipynb
│
├── src/
│   ├── __init__.py
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   └── utils.py
│
├── models/
│   ├── model.pkl
│   └── preprocessing.pkl
│
├── reports/
│   ├── figures/
│   └── model_results.csv
│
├── app/
│   └── app.py
│
├── requirements.txt
├── README.md
└── prompt.md
```

If a simpler structure is more appropriate during the early learning stage, simplify it without making the project disorganized.

---

# 10. Environment Setup

Create a `requirements.txt`.

Use libraries such as:

```text
datasets
pandas
numpy
scikit-learn
matplotlib
joblib
streamlit
```

Optional:

```text
imbalanced-learn
```

Do not add unnecessary libraries.

Avoid heavy dependencies.

---

# 11. Step 1 — Load Dataset

Use:

```python
from datasets import load_dataset

dataset = load_dataset("cestwc/bank-marketing")
```

Then:

```python
df = dataset["train"].to_pandas()
```

Display:

```python
df.head()
df.tail()
df.shape
df.info()
df.columns
df.describe()
```

Explain what every operation does.

---

# 12. Step 2 — Dataset Understanding

Analyze:

```text
Number of rows
Number of columns
Column names
Data types
Target feature
Numerical features
Categorical features
Unique values
```

Automatically identify:

```python
numerical_features
categorical_features
```

Do not hardcode feature categories unnecessarily if Pandas can detect them.

However, manually verify the result.

---

# 13. Step 3 — Data Quality Inspection

Check:

```text
Missing values
Duplicate rows
Invalid values
Unknown values
Extreme values
Data type inconsistencies
```

Use code such as:

```python
df.isnull().sum()
df.duplicated().sum()
df.nunique()
```

For categorical columns, inspect:

```python
df[column].value_counts()
```

Pay attention to the category:

```text
unknown
```

Do not automatically remove `unknown`.

First explain whether it represents:

```text
missing information
or
a legitimate dataset category
```

---

# 14. Step 4 — Duplicate Handling

Check duplicate rows.

If duplicates exist:

1. report the number,
2. inspect some duplicated observations,
3. explain whether removing them is justified.

Do not delete rows blindly.

---

# 15. Step 5 — Missing Values

Check missing values.

For every column with missing data:

Explain:

```text
how many values are missing,
what percentage is missing,
possible impact,
recommended treatment.
```

Possible treatments:

```text
drop
median
mode
most_frequent
unknown category
```

Choose the method based on the feature type.

---

# 16. Step 6 — Exploratory Data Analysis

Perform EDA systematically.

Analyze target distribution first.

Example:

```python
df["y"].value_counts()
df["y"].value_counts(normalize=True)
```

Create visualizations where useful.

Use:

```text
matplotlib
```

Possible analysis:

### Numerical

```text
age
balance
day
duration
campaign
pdays
previous
```

Analyze:

```text
distribution
mean
median
minimum
maximum
standard deviation
outliers
skewness
```

### Categorical

Analyze:

```text
job
marital
education
default
housing
loan
contact
month
poutcome
```

---

# 17. EDA Questions

Try to answer:

```text
Which job categories subscribe most frequently?

Does education level relate to subscription?

Does housing loan status affect subscription?

Does personal loan status affect subscription?

Does account balance differ between YES and NO customers?

Does previous campaign success relate to subscription?

Does call duration strongly correlate with subscription?

Does customer age affect subscription probability?
```

Do not claim causation.

Use terms such as:

```text
association
relationship
pattern
difference
```

unless causal evidence exists.

---

# 18. Class Imbalance Analysis

Calculate target percentages.

Explain why this dataset is imbalanced.

Example concept:

```text
NO  >> YES
```

Explain why this causes a problem.

For example, a model predicting:

```text
NO for every customer
```

could still obtain high accuracy.

Therefore compare:

```text
accuracy
precision
recall
F1
ROC-AUC
PR-AUC
```

---

# 19. Train-Test Split

Split:

```text
80% training
20% testing
```

Use:

```python
train_test_split()
```

Parameters:

```python
test_size=0.20
random_state=42
stratify=y
```

Explain each parameter.

Especially explain:

```python
stratify=y
```

and why it is important for imbalanced classification.

---

# 20. Avoid Data Leakage

All preprocessing that learns information from data must be fitted only on:

```text
training data
```

Examples:

```text
StandardScaler
OneHotEncoder
Imputer
```

Use:

```text
Pipeline
ColumnTransformer
```

whenever possible.

Do not preprocess the entire dataset before train-test splitting.

---

# 21. Numerical Preprocessing

Recommended numerical features:

```text
age
balance
day
duration
campaign
pdays
previous
```

Use appropriate preprocessing.

For Logistic Regression consider:

```python
StandardScaler()
```

Explain:

```text
why scaling is needed,
what StandardScaler does,
which algorithms benefit from scaling.
```

---

# 22. Categorical Preprocessing

Categorical variables must be encoded.

Use:

```python
OneHotEncoder(
    handle_unknown="ignore"
)
```

Explain:

```text
what categorical encoding is,
why machine learning cannot directly use strings,
what one-hot encoding produces,
why handle_unknown="ignore" is useful.
```

---

# 23. ColumnTransformer

Create separate pipelines for:

```text
numerical features
categorical features
```

Example architecture:

```text
Raw Dataset
       |
       +------------------+
       |                  |
       v                  v

Numerical            Categorical

       |                  |
StandardScaler      OneHotEncoder
       |                  |
       +---------+--------+
                 |
                 v

        Machine Learning Model
```

Implement this using:

```python
ColumnTransformer
```

---

# 24. Machine Learning Models

Train these models.

## Model 1

```text
Logistic Regression
```

## Model 2

```text
Decision Tree
```

## Model 3

```text
Random Forest
```

Do not introduce additional models until these are completed and understood.

---

# 25. Logistic Regression

This is the primary baseline model.

First train:

```python
LogisticRegression(
    max_iter=1000,
    random_state=42
)
```

If `random_state` is unsupported or irrelevant for a specific solver, explain this rather than forcing unnecessary parameters.

Evaluate the model.

Then train another version:

```python
LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)
```

Compare:

```text
normal Logistic Regression

vs

balanced Logistic Regression
```

---

# 26. Explain Logistic Regression

Explain the model conceptually before or after implementation.

Explain:

```text
probability
binary classification
sigmoid function
decision threshold
coefficients
odds
```

Do not overcomplicate the mathematics.

Provide equations only when they help understanding.

---

# 27. Decision Tree

Train:

```python
DecisionTreeClassifier()
```

Control overfitting using parameters such as:

```text
max_depth
min_samples_split
min_samples_leaf
```

Do not blindly use unrestricted trees.

Compare:

```text
training score
testing score
```

Explain how a large difference may indicate overfitting.

---

# 28. Random Forest

Train:

```python
RandomForestClassifier()
```

Start with reasonable lightweight settings.

Example:

```python
n_estimators=100
random_state=42
class_weight="balanced"
n_jobs=-1
```

If resource usage becomes excessive, reduce:

```text
n_estimators
n_jobs
```

The project must remain comfortable for a personal computer.

---

# 29. Prediction Metrics

For every model calculate:

```text
Accuracy
Precision
Recall
F1-Score
ROC-AUC
PR-AUC
```

Use:

```python
classification_report()
confusion_matrix()
roc_auc_score()
average_precision_score()
```

Also generate prediction probabilities using:

```python
predict_proba()
```

when supported.

---

# 30. Confusion Matrix

Explain:

```text
True Positive
True Negative
False Positive
False Negative
```

Interpret them specifically for bank marketing.

Example:

```text
True Positive:
Customer actually subscribed and model predicted YES.

False Positive:
Model predicted customer would subscribe but customer did not.

False Negative:
Customer actually subscribed but model predicted NO.
```

Explain why False Negatives may be important in marketing lead identification.

---

# 31. Model Comparison Table

Create a Pandas DataFrame containing:

```text
Model
Accuracy
Precision
Recall
F1
ROC-AUC
PR-AUC
```

Example structure:

```text
-------------------------------------------------------
Model                 Acc   Prec   Recall   F1   ROC-AUC
-------------------------------------------------------
Logistic Regression   ...
Logistic Balanced     ...
Decision Tree         ...
Random Forest         ...
-------------------------------------------------------
```

Save results to:

```text
reports/model_results.csv
```

---

# 32. Do Not Choose Model Based Only on Accuracy

Model selection must consider:

```text
minority-class performance
recall
precision
F1-score
ROC-AUC
PR-AUC
complexity
interpretability
prediction use case
```

Explain trade-offs.

---

# 33. Duration Experiment

Create two datasets.

## Dataset A

```text
All features
```

including:

```text
duration
```

## Dataset B

Remove:

```text
duration
```

Train at least:

```text
Logistic Regression
Random Forest
```

on both.

Create comparison:

```text
Model
Duration Used
Accuracy
Precision
Recall
F1
ROC-AUC
PR-AUC
```

Explain the result.

---

# 34. Feature Importance

For Random Forest extract:

```python
feature_importances_
```

Because preprocessing uses OneHotEncoding, correctly retrieve transformed feature names.

Show the top:

```text
10
15
or
20
```

most influential features.

Create a horizontal bar plot.

Do not assume feature importance implies causation.

---

# 35. Logistic Regression Coefficients

If technically reasonable, also inspect Logistic Regression coefficients.

Display features with:

```text
largest positive coefficients
largest negative coefficients
```

Explain that coefficients represent model associations and not causal effects.

---

# 36. Error Analysis

Inspect incorrect predictions.

Create datasets for:

```text
False Positives
False Negatives
```

Analyze patterns.

Questions:

```text
What characteristics are common among False Negatives?

Are specific job categories frequently misclassified?

Does balance affect errors?

Does previous campaign outcome affect errors?

Are errors concentrated in certain age groups?
```

---

# 37. Threshold Optimization

The default classification threshold is usually:

```text
0.5
```

Test several thresholds:

```text
0.30
0.40
0.50
0.60
0.70
```

Compare:

```text
precision
recall
F1
```

Explain the trade-off.

Do not automatically claim one threshold is universally best.

Use business context.

---

# 38. Model Saving

After choosing the final model, save the complete pipeline.

Use:

```python
joblib
```

Example:

```python
joblib.dump(model, "models/bank_marketing_model.pkl")
```

Prefer saving the entire preprocessing + model pipeline.

This prevents preprocessing mismatches during deployment.

---

# 39. Prediction Function

Create:

```python
predict_customer()
```

Example:

```python
def predict_customer(customer_data):
    ...
```

Output:

```text
prediction
probability
```

Example response:

```text
Prediction: YES
Subscription Probability: 72.41%
```

---

# 40. Streamlit Application

Create a simple user interface using:

```text
Streamlit
```

File:

```text
app/app.py
```

The form should contain inputs such as:

```text
Age
Job
Marital Status
Education
Default
Balance
Housing Loan
Personal Loan
Contact
Month
Campaign
Previous
Previous Campaign Outcome
```

If the final production model intentionally excludes:

```text
duration
```

do not ask users to enter it.

---

# 41. Streamlit Output

Display:

```text
Prediction

YES
or
NO
```

And:

```text
Subscription probability
```

Example UI:

```text
-------------------------------------

BANK MARKETING PREDICTION

Age
[ 35 ]

Job
[ Management ]

Balance
[ 7500 ]

Housing
[ No ]

Loan
[ No ]

        [ PREDICT ]

Prediction:
YES

Probability:
72.4%

-------------------------------------
```

---

# 42. Code Quality Requirements

Use clean Python coding standards.

Follow:

```text
PEP 8
meaningful variable names
small reusable functions
clear function responsibilities
docstrings
type hints where useful
```

Avoid:

```text
unnecessary global variables
duplicated code
huge functions
magic numbers
dead code
unused imports
```

---

# 43. Commenting Requirement

This project is also used for learning.

Important code must include educational comments.

Example:

```python
# Separate input features from the target variable.
X = df.drop(columns=["y"])

# The target variable contains the final class we want to predict.
y = df["y"]
```

Comments must explain:

```text
WHY
```

not only:

```text
WHAT
```

Bad:

```python
# Create model
model = LogisticRegression()
```

Better:

```python
# Logistic Regression is used as the baseline because the target
# contains two classes and the model is lightweight and interpretable.
model = LogisticRegression(max_iter=1000)
```

---

# 44. Explain Important Code Line by Line

For important Machine Learning sections explain code line by line.

Especially:

```text
train_test_split
ColumnTransformer
Pipeline
OneHotEncoder
StandardScaler
model.fit()
model.predict()
predict_proba()
classification_report()
confusion_matrix()
```

Use this style:

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)
```

Then explain:

```text
X = input features.

y = prediction target.

test_size=0.20 means 20% of the data is reserved for testing.

random_state=42 ensures the split can be reproduced.

stratify=y keeps the YES/NO class proportions similar in both
training and testing datasets.
```

---

# 45. No Data Leakage Rule

Never perform operations such as:

```text
scaling
encoding
imputation
feature selection
oversampling
```

on the entire dataset before train-test splitting.

Any learned preprocessing must only learn from:

```text
X_train
```

Explain whenever this rule is relevant.

---

# 46. SMOTE

Do not use SMOTE at the beginning.

First compare:

```text
normal model

vs

class_weight="balanced"
```

Only after those experiments, optionally test:

```text
SMOTE
```

If SMOTE is used:

apply it ONLY to the training data.

Never apply SMOTE to:

```text
validation data
test data
```

---

# 47. Hyperparameter Tuning

Only perform tuning after baseline models are complete.

Use a small search space.

Possible:

```text
GridSearchCV
RandomizedSearchCV
```

Use:

```text
StratifiedKFold
```

Possible Random Forest parameters:

```text
n_estimators
max_depth
min_samples_split
min_samples_leaf
max_features
```

Avoid extremely large searches.

---

# 48. Cross Validation

Perform cross-validation for final candidate models.

Recommended:

```python
StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)
```

Evaluate:

```text
F1
ROC-AUC
PR-AUC
```

Explain why stratified cross validation is useful for imbalanced classification.

---

# 49. Reproducibility

Use:

```text
random_state=42
```

where applicable.

Document:

```text
Python version
library versions
random seed
dataset source
```

---

# 50. Final Analysis

At the end explain:

```text
What was learned from the dataset?

How serious was class imbalance?

How did Logistic Regression perform?

How did class weighting affect the result?

How did Decision Tree behave?

Did Decision Tree overfit?

How did Random Forest perform?

What effect did removing duration have?

Which features were most influential?

What errors did the model make?

What are the limitations?
```

---

# 51. Model Limitations

Discuss limitations such as:

```text
historical dataset
class imbalance
unknown categories
campaign-specific characteristics
possible demographic bias
prediction-time availability of features
correlation vs causation
model generalization
```

Do not claim the model can automatically generalize to all banks or countries.

---

# 52. Ethical Considerations

Because this dataset involves customer information, discuss responsible use.

Do not recommend using the model to unfairly discriminate against customers.

Analyze potentially sensitive or proxy variables carefully.

The model should be positioned as:

```text
decision-support
```

rather than:

```text
automatic customer exclusion
```

---

# 53. README.md

Generate a professional README containing:

```text
Project Overview
Problem Statement
Dataset
Features
Machine Learning Workflow
Installation
How to Run
Models
Evaluation Metrics
Results
Duration Experiment
Project Structure
Deployment
Limitations
Future Improvements
```

Include commands:

```bash
pip install -r requirements.txt
```

and:

```bash
streamlit run app/app.py
```

---

# 54. Notebook Requirements

Each notebook must have a clear goal.

## 01_data_understanding.ipynb

Contains:

```text
dataset loading
dataset structure
columns
data types
summary statistics
target distribution
```

## 02_data_cleaning.ipynb

Contains:

```text
missing values
duplicates
unknown values
outliers
data quality
```

## 03_eda.ipynb

Contains:

```text
target distribution
numerical analysis
categorical analysis
target relationships
visualization
```

## 04_logistic_regression.ipynb

Contains:

```text
preprocessing
train/test split
Logistic Regression
class imbalance
evaluation
```

## 05_tree_models.ipynb

Contains:

```text
Decision Tree
Random Forest
feature importance
overfitting analysis
```

## 06_model_comparison.ipynb

Contains:

```text
model comparison
duration experiment
threshold analysis
error analysis
final model
```

---

# 55. Expected Workflow

The final project workflow should conceptually follow:

```text
Hugging Face Dataset
        |
        v
Load Dataset
        |
        v
Convert to Pandas
        |
        v
Data Understanding
        |
        v
Data Quality Inspection
        |
        v
Data Cleaning
        |
        v
Exploratory Data Analysis
        |
        v
Separate X and y
        |
        v
Train / Test Split
        |
        v
Preprocessing Pipeline
        |
        +-----------------------+
        |                       |
        v                       v

Numerical Features       Categorical Features

        |                       |
StandardScaler           OneHotEncoder
        |                       |
        +-----------+-----------+
                    |
                    v

             Model Training
                    |
      +-------------+-------------+
      |             |             |
      v             v             v

 Logistic       Decision       Random
 Regression       Tree         Forest

      |             |             |
      +-------------+-------------+
                    |
                    v

               Evaluation
                    |
                    v

        Precision / Recall / F1
          ROC-AUC / PR-AUC
                    |
                    v

          Duration Experiment
                    |
                    v

             Error Analysis
                    |
                    v

             Final Pipeline
                    |
                    v

               Save Model
                    |
                    v

             Streamlit App
```

---

# 56. Development Rules

Follow these rules strictly.

## Rule 1

Do not jump directly to model training.

Understand the dataset first.

## Rule 2

Do not remove data automatically.

Explain every cleaning decision.

## Rule 3

Do not use Accuracy as the only metric.

## Rule 4

Always protect against data leakage.

## Rule 5

Use stratified splitting.

## Rule 6

Always compare model performance on unseen test data.

## Rule 7

Always establish a baseline before tuning.

## Rule 8

Keep computational requirements reasonable.

## Rule 9

Do not use Deep Learning.

## Rule 10

Do not hide errors.

If an error occurs:

```text
identify the error
explain the cause
fix the root cause
verify the fix
```

## Rule 11

Do not generate fake evaluation values.

All metrics must be calculated from the actual dataset.

## Rule 12

Do not invent dataset properties.

Inspect them programmatically.

---

# 57. Teaching Mode

Because this project is also intended for learning, after every major section provide:

```text
What we did
Why we did it
What the code means
What the result means
What could go wrong
What we should do next
```

Example:

```text
WHAT WE DID:
Split the dataset into training and testing data.

WHY:
We need unseen data to objectively evaluate the model.

WHAT THE CODE MEANS:
train_test_split divides X and y into training and testing sets.

WHAT THE RESULT MEANS:
The training dataset will be used to learn patterns while the test
dataset is reserved for final evaluation.

POSSIBLE PROBLEM:
If we preprocess the entire dataset before splitting, information from
the test set may leak into training.

NEXT STEP:
Build the preprocessing pipeline.
```

---

# 58. Output Style

When explaining results, use simple but technically correct language.

Avoid unnecessary jargon.

When jargon must be used, explain it immediately.

For example:

```text
Recall measures how many actual positive customers were successfully
identified by the model.
```

Do not simply state:

```text
Recall = TP / TP + FN
```

without explaining its meaning.

---

# 59. Final Deliverables

At the end the project should contain:

```text
Working dataset loader
Cleaned dataset workflow
EDA
Preprocessing pipeline
Logistic Regression model
Balanced Logistic Regression
Decision Tree model
Random Forest model
Model evaluation
Model comparison
Confusion matrices
ROC-AUC analysis
PR-AUC analysis
Feature importance
Duration experiment
Threshold analysis
Error analysis
Saved ML pipeline
Prediction function
Streamlit interface
README
requirements.txt
```

---

# 60. Final Success Criteria

The project is considered complete only if:

```text
[ ] Dataset loads correctly

[ ] Dataset structure is understood

[ ] Missing values are checked

[ ] Duplicate rows are checked

[ ] Unknown categories are inspected

[ ] Target imbalance is analyzed

[ ] EDA is complete

[ ] X and y are correctly defined

[ ] Stratified train/test split is implemented

[ ] Numerical preprocessing is implemented

[ ] Categorical preprocessing is implemented

[ ] Pipeline prevents leakage

[ ] Logistic Regression is trained

[ ] Balanced Logistic Regression is trained

[ ] Decision Tree is trained

[ ] Random Forest is trained

[ ] Accuracy is calculated

[ ] Precision is calculated

[ ] Recall is calculated

[ ] F1-score is calculated

[ ] ROC-AUC is calculated

[ ] PR-AUC is calculated

[ ] Confusion Matrix is generated

[ ] Models are compared

[ ] Duration experiment is performed

[ ] Feature importance is analyzed

[ ] False Positive analysis is performed

[ ] False Negative analysis is performed

[ ] Prediction threshold is investigated

[ ] Final model pipeline is saved

[ ] Prediction function works

[ ] Streamlit app works

[ ] README is complete

[ ] requirements.txt is complete
```

---

# 61. Initial Task

Start the implementation from:

```text
PHASE 1 — DATASET UNDERSTANDING
```

Perform only these tasks first:

```text
1. Create the project folder structure.
2. Create requirements.txt.
3. Load cestwc/bank-marketing from Hugging Face.
4. Convert the train split to Pandas.
5. Display dataset shape.
6. Display the first 10 rows.
7. Display all column names.
8. Inspect data types.
9. Identify numerical columns.
10. Identify categorical columns.
11. Display descriptive statistics.
12. Analyze target distribution.
13. Check missing values.
14. Check duplicated rows.
15. Inspect unique categorical values.
```

After completing the phase, provide a structured report:

```text
PHASE 1 RESULT

Dataset Size:
Target:
Numerical Features:
Categorical Features:
Missing Values:
Duplicates:
Class Distribution:
Potential Data Quality Problems:
Important Findings:
Recommended Next Step:
```

Do not move to model training before completing and explaining Phase 1.

---

# 62. Coding Principle

Always prioritize:

```text
Correctness
    ↓
Data Integrity
    ↓
No Data Leakage
    ↓
Readability
    ↓
Reproducibility
    ↓
Performance
    ↓
Optimization
```

Never sacrifice correctness or data integrity just to make the model appear more accurate.

---

# 63. Final Instruction

Work incrementally.

Do not generate the entire project as one giant unverified code block.

For every phase:

```text
IMPLEMENT
   ↓
RUN / VERIFY
   ↓
EXPLAIN RESULT
   ↓
FIX PROBLEMS
   ↓
CONTINUE
```

The objective is not only to create a working Machine Learning project.

The objective is to make the project understandable enough that a beginner can explain:

```text
where the data comes from,
how the data is prepared,
why a model is selected,
how the model learns,
how predictions are evaluated,
why class imbalance matters,
how leakage happens,
and why the final model behaves the way it does.
```