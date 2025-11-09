from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sqlite3
import pandas as pd
import numpy as np
import os
from interactive_gru_predictor import load_model_and_scaler, predict_future_usage, suggest_param_adjustment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DB_PATH = os.path.join(os.path.dirname(__file__), 'gru_predictions.sqlite')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper to fetch building history from DB
def get_building_history(building_id: int, seq_length: int = 24) -> pd.DataFrame:
    with sqlite3.connect(DB_PATH) as conn:
        df = pd.read_sql_query(
            f"SELECT * FROM energy_data WHERE building_id = ? ORDER BY timestamp ASC", conn, params=(building_id,)
        )
    if len(df) < seq_length:
        raise ValueError(f"Not enough data for building {building_id} (need at least {seq_length} rows)")
    return df

@app.get("/building/{building_id}")
def get_building_data(building_id: int):
    """
    Get all actual and predicted data for a building.

    Path parameter:
        building_id (int): The building ID to fetch data for.

    Returns: List of dicts, each with all columns from the database for the building, including:
        - timestamp (str): ISO timestamp
        - meter_reading (float): Actual meter reading
        - predicted_meter_reading (float): Model prediction (may be null for some rows)
        - All other static and weather features used by the model

    Example response:
    [
        {
            "timestamp": "2016-01-01T00:00:00",
            "meter_reading": 123.4,
            "predicted_meter_reading": 120.1,
            ...
        },
        ...
    ]
    """
    with sqlite3.connect(DB_PATH) as conn:
        df = pd.read_sql_query(
            f"SELECT * FROM energy_data WHERE building_id = ? ORDER BY timestamp ASC", conn, params=(building_id,)
        )
    # Replace NaN and infinite values with None for JSON serialization
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.astype(object).where(pd.notnull(df), None)
    return df.to_dict(orient="records")

class PredictRequest(BaseModel):
    building_id: int
    user_params: Dict[str, Any]
    predict_hours: int = 24  # Default to 24 hours
    seq_length: int = 24

@app.post("/predict_future_usage")
def predict_future_usage_route(req: PredictRequest):
    """
    Predict future energy usage for a building for the next N hours.
    
    Request JSON body:
    {
        "building_id": int,  # Building ID to predict for
        "user_params": {
            "air_temperature": float,
            "cloud_coverage": float,
            "dew_temperature": float,
            "sea_level_pressure": float,
            "wind_speed": float,
            "floor_count": int
        },
        "predict_hours": int,  # Number of hours to predict (default 24)
        "seq_length": int      # Sequence length for model (default 24)
    }

    Returns: List of dicts, each with:
    [
        {
            "timestamp": str,  # ISO timestamp for prediction
            "predicted_meter_reading": float
        },
        ...
    ]
    """
    model, scaler, le = load_model_and_scaler(MODEL_DIR)
    df = get_building_history(req.building_id, req.seq_length)
    features = [
        'building_id', 'meter', 'site_id', 'primary_use', 'square_feet',
        'year_built', 'floor_count', 'air_temperature', 'cloud_coverage',
        'dew_temperature', 'sea_level_pressure', 'wind_speed',
        'hour', 'day_of_week', 'month'
    ]
    # Ensure 'primary_use' is integer-encoded
    if df['primary_use'].dtype == object:
        df['primary_use'] = le.transform(df['primary_use'])
    pred_df = predict_future_usage(
        model, scaler, le,
        df,
        features,
        req.user_params,
        predict_hours=req.predict_hours,
        seq_length=req.seq_length
    )
    return pred_df.to_dict(orient="records")

class SuggestRequest(BaseModel):
    building_id: int
    user_params: Dict[str, Any]
    target_usage: float
    param_candidates: Optional[List[str]] = None
    seq_length: int = 24

@app.post("/suggest_param_adjustment")
def suggest_param_adjustment_route(req: SuggestRequest):
    """
    Suggest values for dynamic parameters to achieve a target energy usage at the next time step.

    Request JSON body:
    {
        "building_id": int,  # Building ID to suggest for
        "user_params": {
            "air_temperature": float,
            "cloud_coverage": float,
            "dew_temperature": float,
            "sea_level_pressure": float,
            "wind_speed": float,
            "floor_count": int
        },
        "target_usage": float,  # Desired meter reading
        "param_candidates": [str, ...],  # (Optional) Which params to adjust
        "seq_length": int  # Sequence length for model (default 24)
    }

    Returns: Dict of {param_name: suggested_value} for each dynamic parameter.
    Example:
    {
        "air_temperature": 21.5,
        "cloud_coverage": 2.0,
        ...
    }
    """
    model, scaler, le = load_model_and_scaler(MODEL_DIR)
    df = get_building_history(req.building_id, req.seq_length)
    features = [
        'building_id', 'meter', 'site_id', 'primary_use', 'square_feet',
        'year_built', 'floor_count', 'air_temperature', 'cloud_coverage',
        'dew_temperature', 'sea_level_pressure', 'wind_speed',
        'hour', 'day_of_week', 'month'
    ]
    # Ensure 'primary_use' is integer-encoded
    if df['primary_use'].dtype == object:
        df['primary_use'] = le.transform(df['primary_use'])
    # If param_candidates is not provided, suggest a broader set of parameters
    default_params = [
        'air_temperature', 'cloud_coverage', 'dew_temperature', 'sea_level_pressure',
        'wind_speed', 'square_feet', 'year_built', 'floor_count', 'meter', 'site_id',
        'primary_use', 'hour', 'day_of_week', 'month'
    ]
    param_candidates = req.param_candidates if req.param_candidates is not None else default_params
    adjustments = suggest_param_adjustment(
        model, scaler, le,
        df,
        features,
        req.user_params,
        req.target_usage,
        param_candidates=param_candidates,
        seq_length=req.seq_length
    )
    return adjustments