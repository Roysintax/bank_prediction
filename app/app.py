"""Streamlit application for Bank Marketing Subscription Prediction."""

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st
from src.predict import predict_customer

# Page Configuration
st.set_page_config(
    page_title="Bank Marketing Subscription Prediction",
    page_icon="🏦",
    layout="centered",
)

# Custom Styling
st.markdown(
    """
    <style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #f59e0b;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1rem;
        color: #94a3b8;
        margin-bottom: 1.5rem;
    }
    .result-box-yes {
        background-color: rgba(16, 185, 129, 0.15);
        border: 2px solid #10b981;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        margin-top: 20px;
    }
    .result-box-no {
        background-color: rgba(239, 68, 68, 0.15);
        border: 2px solid #ef4444;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        margin-top: 20px;
    }
    .res-val {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 10px 0;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown('<div class="main-title">BANK MARKETING PREDICTION</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-title">Pre-Call Lead Scoring Model (Duration Leakage-Free)</div>',
    unsafe_allow_html=True,
)

with st.form("customer_prediction_form"):
    st.subheader("Customer Characteristics")
    col1, col2 = st.columns(2)

    with col1:
        age = st.number_input("Age", min_value=18, max_value=100, value=35, step=1)
        job = st.selectbox(
            "Job",
            options=[
                "management",
                "technician",
                "blue-collar",
                "admin.",
                "services",
                "retired",
                "self-employed",
                "entrepreneur",
                "unemployed",
                "housemaid",
                "student",
                "unknown",
            ],
            index=0,
        )
        marital = st.selectbox("Marital Status", options=["married", "single", "divorced"], index=0)
        education = st.selectbox(
            "Education", options=["tertiary", "secondary", "primary", "unknown"], index=0
        )
        default = st.selectbox("Credit Default", options=["no", "yes"], index=0)
        balance = st.number_input("Average Balance (€/$)", value=2500, step=100)

    with col2:
        housing = st.selectbox("Housing Loan", options=["no", "yes"], index=0)
        loan = st.selectbox("Personal Loan", options=["no", "yes"], index=0)
        contact = st.selectbox("Contact Communication", options=["cellular", "telephone", "unknown"], index=0)
        month = st.selectbox(
            "Contact Month",
            options=["may", "jul", "aug", "jun", "nov", "apr", "feb", "jan", "oct", "sep", "mar", "dec"],
            index=8,  # 'oct'
        )
        campaign = st.number_input("Campaign Contacts", min_value=1, max_value=50, value=1, step=1)
        pdays = st.number_input(
            "Days Since Previous Campaign (999 = Never)", min_value=-1, max_value=999, value=999, step=1
        )
        previous = st.number_input("Previous Contacts Count", min_value=0, max_value=50, value=0, step=1)
        poutcome = st.selectbox(
            "Previous Campaign Outcome", options=["unknown", "failure", "other", "success"], index=3
        )

    submit_button = st.form_submit_button("PREDICT", use_container_width=True)

if submit_button:
    customer_data = {
        "age": age,
        "job": job,
        "marital": marital,
        "education": education,
        "default": default,
        "balance": balance,
        "housing": housing,
        "loan": loan,
        "contact": contact,
        "day": 15,
        "month": month,
        "campaign": campaign,
        "pdays": pdays,
        "previous": previous,
        "poutcome": poutcome,
    }

    try:
        res = predict_customer(customer_data)
        prediction = res["prediction"]
        probability_pct = res["probability_pct"]
        risk_tier = res["risk_tier"]

        if prediction == "YES":
            st.markdown(
                f"""
                <div class="result-box-yes">
                    <h3 style="color: #10b981; margin: 0;">Prediction:</h3>
                    <div class="res-val" style="color: #10b981;">YES</div>
                    <p style="font-size: 1.2rem; margin: 0;"><strong>Subscription Probability: {probability_pct}</strong></p>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">Tier: {risk_tier}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""
                <div class="result-box-no">
                    <h3 style="color: #ef4444; margin: 0;">Prediction:</h3>
                    <div class="res-val" style="color: #ef4444;">NO</div>
                    <p style="font-size: 1.2rem; margin: 0;"><strong>Subscription Probability: {probability_pct}</strong></p>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">Tier: {risk_tier}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    except Exception as e:
        st.error(f"Error making prediction: {e}")
