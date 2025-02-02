import pandas as pd
import numpy as np

def generate_random_predictions():

    # Number of rows and columns
    num_rows = 13
    num_cols = 5  # Including Total Market

    # Create a DataFrame with random float numbers
    data = {}
    column_names = ["ASDA", "MORRISONS", "SAINSBURYS", "TESCO", "TOTAL_MARKET"]
    months = [f"{month}-{year}" for year in [25,26] for month in ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]][:13]
    for col in column_names:
        data[col] = np.random.rand(num_rows) * 10000 # Random float numbers up to 10000

    df = pd.DataFrame(data, index=months)

    # Ensure Total Markets is greater than the sum of others
    for index in df.index:
        total_others = sum(df.loc[index, : "TESCO"])
        df.loc[index, "TOTAL_MARKET"] = total_others + np.random.rand()*1000 # Add a random value to guarantee it is larger


    df = df.round(2)
    df_dict = df.to_dict()

    return df_dict
