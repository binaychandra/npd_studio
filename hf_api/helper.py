import pandas as pd
import numpy as np

def get_sample_similarity_attr():
    sample_sim = {
        "GB1263": {
            "sell_in_volume": 44426.88,
            "similarity": 66.67,
            "distribution": [
                0,
                0,
                0,
                0,
                0,
                0,
                8,
                9,
                9,
                9,
                6,
                5,
                7,
                25,
                26,
                27
            ],
            "week_date": [
                "2024-05-13",
                "2024-05-20",
                "2024-05-27",
                "2024-06-03",
                "2024-06-10",
                "2024-06-17",
                "2024-06-24",
                "2024-07-01",
                "2024-07-08",
                "2024-07-15",
                "2024-07-22",
                "2024-07-29",
                "2024-08-05",
                "2024-08-12",
                "2024-08-19",
                "2024-08-26"
            ]
        },
        "GB1264": {
            "sell_in_volume": 26840.97,
            "similarity": 66.67,
            "distribution": [
                0,
                0,
                0,
                0,
                0,
                0,
                6,
                8,
                8,
                8,
                5,
                4,
                6,
                25,
                26,
                27
            ],
            "week_date": [
                "2024-05-13",
                "2024-05-20",
                "2024-05-27",
                "2024-06-03",
                "2024-06-10",
                "2024-06-17",
                "2024-06-24",
                "2024-07-01",
                "2024-07-08",
                "2024-07-15",
                "2024-07-22",
                "2024-07-29",
                "2024-08-05",
                "2024-08-12",
                "2024-08-19",
                "2024-08-26"
            ]
        },
        "GB1450": {
            "sell_in_volume": 32346.0,
            "similarity": 66.67,
            "distribution": [
                0,
                0,
                0,
                0,
                0,
                0,
                6,
                8,
                9,
                8,
                6,
                4,
                6,
                25,
                26,
                27
            ],
            "week_date": [
                "2024-05-13",
                "2024-05-20",
                "2024-05-27",
                "2024-06-03",
                "2024-06-10",
                "2024-06-17",
                "2024-06-24",
                "2024-07-01",
                "2024-07-08",
                "2024-07-15",
                "2024-07-22",
                "2024-07-29",
                "2024-08-05",
                "2024-08-12",
                "2024-08-19",
                "2024-08-26"
            ]
        },
        "GB1561": {
            "sell_in_volume": 3265.92,
            "similarity": 77.78,
            "distribution": [
                91,
                34,
                33,
                33,
                32,
                33
            ],
            "week_date": [
                "2024-02-12",
                "2024-02-19",
                "2024-02-26",
                "2024-03-04",
                "2024-03-11",
                "2024-03-18"
            ]
        },
        "GB1650": {
            "sell_in_volume": 0.0,
            "similarity": 77.78,
            "distribution": [
                38,
                30,
                24,
                17,
                14,
                11,
                9,
                7,
                7,
                6,
                5
            ],
            "week_date": [
                "2024-02-12",
                "2024-02-19",
                "2024-02-26",
                "2024-03-04",
                "2024-03-11",
                "2024-03-18",
                "2024-03-25",
                "2024-04-01",
                "2024-04-08",
                "2024-04-15",
                "2024-04-22"
            ]
        }
    }
    return sample_sim

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
