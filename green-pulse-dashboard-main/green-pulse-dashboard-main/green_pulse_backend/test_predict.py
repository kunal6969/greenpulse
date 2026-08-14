import os
import sqlite3
import pandas as pd
import numpy as np
import joblib
import traceback

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from interactive_gru_predictor import load_model_and_scaler, predict_future_usage

def test():
    try:
        model, scaler, le = load_model_and_scaler('model')
        with sqlite3.connect('gru_predictions.sqlite') as conn:
            df = pd.read_sql_query(
                "SELECT * FROM energy_data WHERE building_id = 21 ORDER BY timestamp ASC", conn
            )
        
        if df['primary_use'].dtype == object:
            df['primary_use'] = le.transform(df['primary_use'])
            
        features = [
            'building_id', 'meter', 'site_id', 'primary_use', 'square_feet',
            'year_built', 'floor_count', 'air_temperature', 'cloud_coverage',
            'dew_temperature', 'sea_level_pressure', 'wind_speed',
            'hour', 'day_of_week', 'month'
        ]
        
        user_params = {}
        pred_df = predict_future_usage(
            model, scaler, le,
            df,
            features,
            user_params,
            predict_hours=24,
            seq_length=24
        )
        print("SUCCESS:", len(pred_df))
    except Exception as e:
        print("ERROR:")
        traceback.print_exc()

test()
