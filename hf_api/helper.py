import pandas as pd
import numpy as np
import json

def process_api_response(json_response):
    # Use json.loads() to parse the JSON string
    print("Type of json_response : ", type(json_response))
    input_data = json_response

    # Extract predictions and similarity attributes
    predictions = input_data.get("predictions", {})
    similarity_attr = input_data.get("similarity_attr", {})

    # Convert predictions into a DataFrame and back to a dictionary
    temp_predictions_df = pd.DataFrame(predictions)
    temp_predictions_dict = temp_predictions_df.to_dict()

    # Convert similarity attributes into a DataFrame and back to a dictionary
    sim_attr_df = pd.DataFrame(similarity_attr)
    sample_sim_attr = sim_attr_df.to_dict()

    # Construct final output dictionary
    return temp_predictions_dict, sample_sim_attr   

def get_sample_similarity_attr():
    sample_sim = {
        "PC7623": {
            "description": "MILKA 270G MILK",
            "sell_in_volume": 76234.23,
            "similarity": 66.67,
            "distribution": [
                10, 12, 15, 18, 20, 22, 25, 28,
                30, 32, 35, 38, 40, 42, 45, 48
            ],
            "week_date": [
                "2024-05-13","2024-05-20","2024-05-27","2024-06-03",
                "2024-06-10","2024-06-17","2024-06-24","2024-07-01",
                "2024-07-08","2024-07-15","2024-07-22","2024-07-29",
                "2024-08-05","2024-08-12","2024-08-19","2024-08-26"
            ]
        },
        "PC8345": {
            "description": "MILKA 270G WN",
            "sell_in_volume": 26840.97,
            "similarity": 66.67,
            "distribution": [
                11, 13, 16, 19, 21, 23, 26, 29,
                31, 33, 36, 39, 41, 43, 46, 49
            ],
            "week_date": [
                "2024-05-13","2024-05-20","2024-05-27","2024-06-03",
                "2024-06-10","2024-06-17","2024-06-24","2024-07-01",
                "2024-07-08","2024-07-15","2024-07-22","2024-07-29",
                "2024-08-05","2024-08-12","2024-08-19","2024-08-26"
            ]
        },
        "PC1002": {
            "description": "MILKA OREO",
            "sell_in_volume": 32346.0,
            "similarity": 66.67,
            "distribution": [
                12, 14, 17, 20, 22, 24, 27, 30,
                32, 34, 37, 40, 42, 44, 47, 50
            ],
            "week_date": [
                "2024-05-13","2024-05-20","2024-05-27","2024-06-03",
                "2024-06-10","2024-06-17","2024-06-24","2024-07-01",
                "2024-07-08","2024-07-15","2024-07-22","2024-07-29",
                "2024-08-05","2024-08-12","2024-08-19","2024-08-26"
            ]
        },
        "PC9201": {
            "description": "MIXED DUO PREFILL",
            "sell_in_volume": 3265.92,
            "similarity": 77.78,
            "distribution": [
                15, 20, 25, 30, 35, 40
            ],
            "week_date": [
                "2024-02-12","2024-02-19","2024-02-26",
                "2024-03-04","2024-03-11","2024-03-18"
            ]
        },
        "PC4985": {
            "description": "CAD TWIRL MINT",
            "sell_in_volume": 0.0,
            "similarity": 77.78,
            "distribution": [
                18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48
            ],
            "week_date": [
                "2024-02-12","2024-02-19","2024-02-26","2024-03-04",
                "2024-03-11","2024-03-18","2024-03-25","2024-04-01",
                "2024-04-08","2024-04-15","2024-04-22"
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
