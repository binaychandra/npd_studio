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

from helper import generate_random_predictions, get_sample_similarity_attr, process_api_response

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

    # temp_predictions_dict = generate_random_predictions()
    # sample_sim_attr = get_sample_similarity_attr()
    # data_out = {
    #     "status" : "success",
    #     "data" : {
    #         "id": input.dict()['id'],
    #         "predictions": temp_predictions_dict,
    #         "similarity": sample_sim_attr
    #     }
    # }

    # return data_out

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
            temp_predictions_dict, sample_sim_attr = process_api_response(output_json)
            data_out = {
                        "status" : "success",
                        "data" : {
                            "id": input.dict()['id'],
                            "predictions": temp_predictions_dict,
                            "similarity": sample_sim_attr
                        }
                    }
            #nb_output = output_json['prediction']
            break;
        
    return data_out


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