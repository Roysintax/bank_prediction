window.BANK_DATA = {
  "models": [
    {
      "model": "Logistic Regression",
      "duration_used": false,
      "accuracy": 0.893177043016698,
      "precision": 0.6631205673758865,
      "recall": 0.1767485822306238,
      "f1": 0.2791044776119403,
      "roc_auc": 0.7717390712500873,
      "pr_auc": 0.41101125285995244,
      "confusion_matrix": {
        "tn": 7890,
        "fp": 95,
        "fn": 871,
        "tp": 187
      }
    },
    {
      "model": "Logistic Balanced",
      "duration_used": false,
      "accuracy": 0.7557226584098198,
      "precision": 0.2672866963202588,
      "recall": 0.6247637051039697,
      "f1": 0.37439818748229964,
      "roc_auc": 0.7722118385962338,
      "pr_auc": 0.40938598383140007,
      "confusion_matrix": {
        "tn": 6173,
        "fp": 1812,
        "fn": 397,
        "tp": 661
      }
    },
    {
      "model": "Decision Tree",
      "duration_used": false,
      "accuracy": 0.8225146522171846,
      "precision": 0.33883323512080143,
      "recall": 0.5434782608695652,
      "f1": 0.41742286751361163,
      "roc_auc": 0.7446423646416426,
      "pr_auc": 0.34187019598393276,
      "confusion_matrix": {
        "tn": 6863,
        "fp": 1122,
        "fn": 483,
        "tp": 575
      }
    },
    {
      "model": "Random Forest",
      "duration_used": false,
      "accuracy": 0.8141103616056619,
      "precision": 0.3361388742766965,
      "recall": 0.6039697542533081,
      "f1": 0.43190266982088543,
      "roc_auc": 0.792183003812678,
      "pr_auc": 0.43379770499746334,
      "confusion_matrix": {
        "tn": 6723,
        "fp": 1262,
        "fn": 419,
        "tp": 639
      }
    },
    {
      "model": "Logistic Regression (With Duration)",
      "duration_used": true,
      "accuracy": 0.9011390025434037,
      "precision": 0.6443661971830986,
      "recall": 0.34593572778827975,
      "f1": 0.45018450184501846,
      "roc_auc": 0.9056920288868661,
      "pr_auc": 0.5456942222077238,
      "confusion_matrix": {
        "tn": 7783,
        "fp": 202,
        "fn": 692,
        "tp": 366
      }
    },
    {
      "model": "Random Forest (With Duration)",
      "duration_used": true,
      "accuracy": 0.8439677098308084,
      "precision": 0.41717503519474425,
      "recall": 0.8402646502835539,
      "f1": 0.5575415490749451,
      "roc_auc": 0.9176085121796185,
      "pr_auc": 0.5878079410739275,
      "confusion_matrix": {
        "tn": 6743,
        "fp": 1242,
        "fn": 169,
        "tp": 889
      }
    }
  ],
  "feature_importances": [
    {
      "feature": "poutcome_success",
      "importance": 0.10875759233506826
    },
    {
      "feature": "contact_unknown",
      "importance": 0.08552428976189957
    },
    {
      "feature": "pdays",
      "importance": 0.0796404983987976
    },
    {
      "feature": "age",
      "importance": 0.06697165680351813
    },
    {
      "feature": "balance",
      "importance": 0.06110385838283248
    },
    {
      "feature": "contact_cellular",
      "importance": 0.0503637483881845
    },
    {
      "feature": "day",
      "importance": 0.04823250286704912
    },
    {
      "feature": "housing_no",
      "importance": 0.048157803770975505
    },
    {
      "feature": "housing_yes",
      "importance": 0.04570810337096179
    },
    {
      "feature": "poutcome_unknown",
      "importance": 0.040985975417723974
    },
    {
      "feature": "previous",
      "importance": 0.03853996875905115
    },
    {
      "feature": "campaign",
      "importance": 0.032192822117130725
    },
    {
      "feature": "month_oct",
      "importance": 0.02239860312656864
    },
    {
      "feature": "month_apr",
      "importance": 0.019533281376912688
    },
    {
      "feature": "month_mar",
      "importance": 0.018434416713275076
    },
    {
      "feature": "month_may",
      "importance": 0.017987170019294882
    },
    {
      "feature": "month_aug",
      "importance": 0.017785546048780812
    },
    {
      "feature": "month_jun",
      "importance": 0.016364329547365417
    },
    {
      "feature": "marital_married",
      "importance": 0.015289072089754196
    },
    {
      "feature": "loan_no",
      "importance": 0.013314034688444934
    }
  ],
  "top_coefficients": [
    {
      "feature": "poutcome_success",
      "coefficient": 1.6296330892137432
    },
    {
      "feature": "month_mar",
      "coefficient": 1.2161138795725834
    },
    {
      "feature": "month_jan",
      "coefficient": -1.0580979550495409
    },
    {
      "feature": "month_oct",
      "coefficient": 0.9292264088306108
    },
    {
      "feature": "month_dec",
      "coefficient": 0.87604018809105
    },
    {
      "feature": "month_nov",
      "coefficient": -0.7965589901518989
    },
    {
      "feature": "month_sep",
      "coefficient": 0.7865990729254736
    },
    {
      "feature": "month_aug",
      "coefficient": -0.7448005502206093
    },
    {
      "feature": "contact_unknown",
      "coefficient": -0.7204240569684026
    },
    {
      "feature": "poutcome_failure",
      "coefficient": -0.7056801833409551
    },
    {
      "feature": "month_jul",
      "coefficient": -0.598962064432069
    },
    {
      "feature": "job_retired",
      "coefficient": 0.5096548164294904
    },
    {
      "feature": "contact_cellular",
      "coefficient": 0.48023089493102905
    },
    {
      "feature": "poutcome_other",
      "coefficient": -0.452324539528648
    },
    {
      "feature": "month_may",
      "coefficient": -0.42983740909356716
    },
    {
      "feature": "poutcome_unknown",
      "coefficient": -0.4133119134954439
    },
    {
      "feature": "job_student",
      "coefficient": 0.3468847506514613
    },
    {
      "feature": "job_housemaid",
      "coefficient": -0.327780827907035
    },
    {
      "feature": "contact_telephone",
      "coefficient": 0.2985096148860764
    },
    {
      "feature": "month_feb",
      "coefficient": -0.2974055714179106
    }
  ],
  "threshold_analysis": [
    {
      "threshold": 0.2,
      "precision": 0.1288833437305053,
      "recall": 0.9763705103969754,
      "f1": 0.22770858591425108,
      "predicted_positives": 8015
    },
    {
      "threshold": 0.3,
      "precision": 0.15645925200065328,
      "recall": 0.9054820415879017,
      "f1": 0.2668152067957109,
      "predicted_positives": 6123
    },
    {
      "threshold": 0.4,
      "precision": 0.22405271828665568,
      "recall": 0.7712665406427222,
      "f1": 0.3472340425531915,
      "predicted_positives": 3642
    },
    {
      "threshold": 0.5,
      "precision": 0.3361388742766965,
      "recall": 0.6039697542533081,
      "f1": 0.43190266982088543,
      "predicted_positives": 1901
    },
    {
      "threshold": 0.6,
      "precision": 0.4629277566539924,
      "recall": 0.4603024574669187,
      "f1": 0.46161137440758293,
      "predicted_positives": 1052
    },
    {
      "threshold": 0.7,
      "precision": 0.5638297872340425,
      "recall": 0.3005671077504726,
      "f1": 0.3921085080147966,
      "predicted_positives": 564
    },
    {
      "threshold": 0.8,
      "precision": 0.7076271186440678,
      "recall": 0.15784499054820417,
      "f1": 0.2581143740340031,
      "predicted_positives": 236
    }
  ],
  "summary": {
    "total_samples": 45211,
    "train_samples": 36168,
    "test_samples": 9043,
    "class_0_no": 39922,
    "class_1_yes": 5289,
    "imbalance_ratio": "7.55:1",
    "recommended_model": "Random Forest (Balanced, Leak-Free)"
  }
};