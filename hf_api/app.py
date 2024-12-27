from typing import Union
import os
import requests
import json
import time
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://react-first-tan.vercel.app/"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get_prediction")
def get_prediction_from_jobrun():
    #Add the documentation
    """
    Get the prediction from the Databricks job run
    """
    # Replace these variables with your Databricks workspace information
    DATABRICKS_INSTANCE = 'https://2461626258595269.9.gcp.databricks.com'
    API_TOKEN = os.getenv('API_TOKEN')
    TASK_RUNID = '1054089068841244'

    url = f"{DATABRICKS_INSTANCE}/api/2.1/jobs/runs/get-output"
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    data = {
        "run_id": TASK_RUNID
    }

    #cert_path = r"C:\Users\PD817AE\OneDrive - EY\Desktop\mdlz\pipeline_code\Zscaler Root CA.crt"
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

@app.get("/get_prediction_from_databricks")
def run_xpipeline():
    print(f"Running the pipeline : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ")
    access_token_dev = os.getenv('API_TOKEN')
    headers = {
        "Authorization": f"Bearer {access_token_dev}",
        "Content-Type": "application/json"
    }
    # Pipeline details

    pipeline_id = "413640122908266"  # "326843486210150"
    #sample_df = pd.read_csv("wine_test_dataset.csv")
    #print(f"============= Input Data ============")
    #print(sample_df)
    #print(f"=====================================")

    # Convert the DataFrame to JSON
    json_data = None #sample_df.to_json()
    payload = {
        'job_id': pipeline_id,
        'notebook_params': {
            'data': json_data  # Send data as a JSON string
        }
    }

    # Trigger the run
    api_url = f"https://2461626258595269.9.gcp.databricks.com/api/2.1/jobs/run-now"
    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
    response_json = response.json()
    print(f"\nPrediction pipeline started with details : {response_json}\n")
    run_id = response_json["run_id"]
    #pred_out = pd.DataFrame()
    while True:
        time.sleep(2)
        api_url = f"https://2461626258595269.9.gcp.databricks.com/api/2.1/jobs/runs/get?run_id={run_id}"
        response = requests.get(api_url, headers=headers)
        response_json = response.json()
        task_run_id = response_json['tasks'][0]['run_id']
        run_status = response_json["state"]["life_cycle_state"]
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} Status : {run_status}")
        job_status = response_json["state"].get('result_state')
        if job_status == 'SUCCESS':
            api_url = f"https://2461626258595269.9.gcp.databricks.com/api/2.1/jobs/runs/get-output"
            payload = dict(run_id=task_run_id)
            response = requests.get(api_url, headers=headers, data=json.dumps(payload))
            #response_dict = response.json()
            output_json = json.loads(response.json()['notebook_output']['result'])
            nb_output = output_json['prediction']
            #notebook_output = json.loads(response_dict["notebook_output"]["result"])
            break;
            #pred_out = pd.DataFrame(notebook_output)
            #break

    return nb_output

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}