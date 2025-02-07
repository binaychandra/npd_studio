from typing import Union
import os
import requests
import json
import time
from datetime import datetime
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Query
from transformers import pipeline

from helper import generate_random_predictions, get_sample_similarity_attr

app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Replace these variables with your Databricks workspace information
DATABRICKS_INSTANCE = os.getenv('DATABRICKS_INSTANCE')
API_TOKEN = os.getenv('API_TOKEN')
TASK_RUNID = "1054089068841244"

# from dotenv import load_dotenv, find_dotenv
# _ = load_dotenv(find_dotenv()) # read local .env file

class PredictionInput(BaseModel):
    id:str
    isMinimized: bool
    country: str
    category: str
    basecode: str
    scenario: str
    weekDate: str
    packGroup: str
    productRange: str
    baseNumberInMultipack: str
    segment: str
    superSegment: str
    salty: str
    choco: str
    flavor: str
    levelOfSugar: str
    listPricePerUnitMl: float
    weightPerUnitMl: float

class inputtext(BaseModel):
    inputtext:str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get_prediction")
def get_prediction_from_jobrun():
    #Add the documentation
    """
    Get the prediction from the Databricks job run
    """
    url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get-output"
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    data = {
        "run_id": TASK_RUNID
    }

    response = requests.get(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        print("Pipeline run initiated successfully.")
        output_json = json.loads(response.json()['notebook_output']['result'])
        nb_output = output_json['prediction']
        return nb_output
    else:
        print(response)
        print("Failed to initiate pipeline run.")
        print("Status Code:", response.status_code)
        return response.text

classifier = pipeline("sentiment-analysis")  # Defaults to distilbert-base-uncased-finetuned-sst-2-english

# Define input schema
class InputText(BaseModel):
    text: str  # Expect JSON request body with a "text" field

@app.post("/get_sentiment")
def get_sentiment_details(input: InputText):  
    text = input.text  # Extract the actual string from the Pydantic model

    print(f"===== The type of the text is : {type(text)} =====")  # Debugging output

    result = classifier(text)  # Pass only the extracted string
    label = result[0]['label']
    score = result[0]['score']

    return {"sentiment": label, "score": score}
    
@app.post("/get_prediction_on_userinput")
def run_pred_pipeline(input: PredictionInput):

    print(f"Here is the input dict : {input.dict()}")
    print(f"Running the pipeline : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ")

    ## Hardcoding for testing purposes ##

    temp_predictions_dict = generate_random_predictions()
    sample_sim_attr = get_sample_similarity_attr()
    data_out = {
        "status" : "success",
        "data" : {
            "id": input.dict()['id'],
            "predictions": temp_predictions_dict,
            "similarity_attr": sample_sim_attr
        #     "predictions": {
        #         "ASDA": {
        #             "Apr-25": 741.86,
        #             "May-25": 2624.14,
        #             "Jun-25": 808.83,
        #             "Jul-25": 923.99,
        #             "Aug-25": 280.57,
        #             "Sep-25": 13.72,
        #             "Oct-25": 20.58,
        #             "Nov-25": 23.9,
        #             "Dec-25": 1619.17,
        #             "Jan-26": 1123.3,
        #             "Feb-26": 235.05,
        #             "Mar-26": 162.03,
        #             "Apr-26": 410.15
        #         },
        #         "MORRISONS": {
        #             "Apr-25": 2331.82,
        #             "May-25": 12573.63,
        #             "Jun-25": 8536.11,
        #             "Jul-25": 11987.12,
        #             "Aug-25": 7898.69,
        #             "Sep-25": 6396.44,
        #             "Oct-25": 6263.68,
        #             "Nov-25": 4706.39,
        #             "Dec-25": 4583.83,
        #             "Jan-26": 5898.89,
        #             "Feb-26": 4337.92,
        #             "Mar-26": 6339.77,
        #             "Apr-26": 5191.83
        #         },
        #         "SAINSBURYS": {
        #             "Apr-25": 392.79,
        #             "May-25": 4353.46,
        #             "Jun-25": 2627.94,
        #             "Jul-25": 3361.95,
        #             "Aug-25": 5763.03,
        #             "Sep-25": 2985.44,
        #             "Oct-25": 3457.49,
        #             "Nov-25": 2631.01,
        #             "Dec-25": 2645.14,
        #             "Jan-26": 3034.98,
        #             "Feb-26": 2958.94,
        #             "Mar-26": 4043.73,
        #             "Apr-26": 3364.26
        #         },
        #         "TESCO": {
        #             "Apr-25": 2302.79,
        #             "May-25": 18921.9,
        #             "Jun-25": 17958.08,
        #             "Jul-25": 18710.57,
        #             "Aug-25": 13609.1,
        #             "Sep-25": 18693.05,
        #             "Oct-25": 21091.39,
        #             "Nov-25": 18796.81,
        #             "Dec-25": 21114.51,
        #             "Jan-26": 20039.52,
        #             "Feb-26": 21608.5,
        #             "Mar-26": 22534.27,
        #             "Apr-26": 16405.85
        #         },
        #         "TOTAL_MARKET": {
        #             "Apr-25": 10964.68,
        #             "May-25": 77262.14,
        #             "Jun-25": 62432.31,
        #             "Jul-25": 76078.74,
        #             "Aug-25": 52031.48,
        #             "Sep-25": 47737.41,
        #             "Oct-25": 51094.34,
        #             "Nov-25": 42181.84,
        #             "Dec-25": 47680.7,
        #             "Jan-26": 50010.67,
        #             "Feb-26": 46154.89,
        #             "Mar-26": 49339.0,
        #             "Apr-26": 39747.65
        #         }
        #     }
        }
    }

    return data_out

    print(f"Here is the input dict : {input.dict()}")
    print(f"Running the pipeline : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ")
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    # Pipeline details
    pipeline_id = "403360183892362"
    json_data = None 
    payload = {
        'job_id': pipeline_id,
        'notebook_params': input.dict()
        # 'notebook_params': {
        #     "salesorg_cd": "GB01",
        #     "category_mdlz": "EUCO",
        #     "basecode": "GB10002",
        #     "scenario": "sc_1",
        #     "week_date": "2025-04-28",
        #     "level_of_sugar": "STANDARD",
        #     "pack_group": "CHOC ADULT SGLS",
        #     "product_range": "MILKA",
        #     "segment": "CHOC SGLS",
        #     "supersegment": "STANDARD CHOCOLATE",
        #     "base_number_in_multipack": "SINGLE",
        #     "flavour": "CITRUS",
        #     "choco": "MILK",
        #     "salty": "NO",
        #     "weight_per_unit_mdlz": "0.28",
        #     "list_price_per_unit_mdlz": "1.75"
        #     }
    }

    # Trigger the run
    api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/run-now"
    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    response_json = response.json()
    print(f"\nPrediction pipeline started with details : {response_json}\n")
    run_id = response_json["run_id"]
    #pred_out = pd.DataFrame()
    while True:
        time.sleep(2)
        api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get?run_id={run_id}"
        response = requests.get(api_url, headers=headers)
        response_json = response.json()
        task_run_id = response_json['tasks'][0]['run_id']
        run_status = response_json["state"]["life_cycle_state"]
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} Status : {run_status}")
        job_status = response_json["state"].get('result_state')
        if job_status == 'SUCCESS':
            api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get-output"
            payload = dict(run_id=task_run_id)
            response = requests.get(api_url, headers=headers, data=json.dumps(payload))
            output_json = json.loads(response.json()['notebook_output']['result'])
            #nb_output = output_json['prediction']
            break;

    return output_json


@app.get("/get_prediction_from_databricks")
def run_xpipeline():
    print(f"Running the pipeline : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ")
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    # Pipeline details
    pipeline_id = "413640122908266"
    json_data = None 
    payload = {
        'job_id': pipeline_id,
        'notebook_params': {
            'data': json_data  # Send data as a JSON string
        }
    }

    # Trigger the run
    api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/run-now"
    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    response_json = response.json()
    print(f"\nPrediction pipeline started with details : {response_json}\n")
    run_id = response_json["run_id"]
    #pred_out = pd.DataFrame()
    while True:
        time.sleep(2)
        api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get?run_id={run_id}"
        response = requests.get(api_url, headers=headers)
        response_json = response.json()
        task_run_id = response_json['tasks'][0]['run_id']
        run_status = response_json["state"]["life_cycle_state"]
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} Status : {run_status}")
        job_status = response_json["state"].get('result_state')
        if job_status == 'SUCCESS':
            api_url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get-output"
            payload = dict(run_id=task_run_id)
            response = requests.get(api_url, headers=headers, data=json.dumps(payload))
            output_json = json.loads(response.json()['notebook_output']['result'])
            nb_output = output_json['prediction']
            break;

    return nb_output


class QueryRequest(BaseModel):
    query: str

@app.post("/query_ai")
async def query_ai(request: QueryRequest):
    try:
        # TODO: Implement actual AI processing here
        # For now, return sample product data
        return {
            "status": "success",
            "data": {
                "baseCode": "GB10002",
                "scenario": "SAMPLE_EUCO_Scenario",
                "weekDate": "2025-04-28",
                "levelOfSugar": "STANDARD",
                "packGroup": "CHOC ADULT SGLS",
                "productRange": "MILKA",
                "segment": "CHOC SGLS",
                "superSegment": "STANDARD CHOCOLATE",
                "baseNumberInMultipack": "SINGLE",
                "flavor": "CITRUS",
                "choco": "MILK",
                "salty": "NO",
                "weightPerUnitMl": 0.28,
                "listPricePerUnitMl": 1.75
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}