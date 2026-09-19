"""Data loading and decoding module for Bank Marketing dataset."""

from pathlib import Path
import pandas as pd
from datasets import load_dataset

RAW_DATA_PATH = Path("data/raw/bank_marketing.csv")


def load_bank_marketing_data(use_cache: bool = True) -> pd.DataFrame:
    """Loads cestwc/bank-marketing from Hugging Face and decodes ClassLabel columns to strings.

    Args:
        use_cache: If True and local CSV exists, loads from data/raw/bank_marketing.csv.

    Returns:
        pd.DataFrame: Cleaned raw DataFrame with decoded categorical values and original types.
    """
    if use_cache and RAW_DATA_PATH.exists():
        return pd.read_csv(RAW_DATA_PATH)

    # Load from Hugging Face
    dataset = load_dataset("cestwc/bank-marketing")
    features = dataset["train"].features
    df = dataset["train"].to_pandas()

    # Decode ClassLabel integer IDs to original category strings
    for col, feat in features.items():
        if hasattr(feat, "names"):
            df[col] = df[col].map(lambda x: feat.int2str(x))

    # Cache raw copy locally
    RAW_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(RAW_DATA_PATH, index=False)

    return df


if __name__ == "__main__":
    df = load_bank_marketing_data(use_cache=False)
    print(f"Loaded dataset successfully. Shape: {df.shape}")
