import os
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
import shap

class FertilizerMLService:
    _model = None
    _preprocessor = None
    _target_le = None
    _explainer = None
    _feature_names = None

    @classmethod
    def load_model(cls):
        """Загрузка артефактов при старте Django"""
        base_path = os.path.join(os.path.dirname(__file__), 'ml_models')
        
        try:
            cls._preprocessor = joblib.load(os.path.join(base_path, 'preprocessor.joblib'))
            cls._target_le = joblib.load(os.path.join(base_path, 'target_le.joblib'))
            
            cls._model = xgb.XGBClassifier()
            cls._model.load_model(os.path.join(base_path, 'model.json'))
            
            cls._explainer = shap.TreeExplainer(cls._model)
            
            cat_features = cls._preprocessor.named_transformers_['cat'].get_feature_names_out()
            num_features = cls._preprocessor.named_transformers_['num'].feature_names_in_
            cls._feature_names = list(num_features) + list(cat_features)
            print("--- FertilizerMLService: Модель успешно загружена ---")
        except Exception as e:
            print(f"--- FertilizerMLService: Ошибка загрузки модели: {e} ---")

    @classmethod
    def predict(cls, data: dict) -> dict:
        if cls._model is None:
            cls.load_model()

        input_df = pd.DataFrame([{
            'Temperature': data.get('temperature'),
            'Humidity': data.get('humidity'),
            'Moisture': data.get('moisture', 50),
            'Soil Type': data.get('soilType'),
            'Crop Type': data.get('cropType'),
            'Nitrogen': data.get('nitrogen'),
            'Potassium': data.get('potassium'),
            'Phosphorus': data.get('phosphorus'),
            'pH_Level': data.get('ph'),
            'Rainfall': data.get('rainfall'),
            'Previous_Crop': data.get('previousCrop', 'None'),
            'Season': data.get('season', 'Summer'),
            'Field_Orientation': data.get('fieldOrientation', 'Flat')
        }])

        X_transformed = cls._preprocessor.transform(input_df)

        pred_idx = cls._model.predict(X_transformed)[0]
        probs = cls._model.predict_proba(X_transformed)[0]
        
        recommended_fert = cls._target_le.inverse_transform([pred_idx])[0]
        confidence = float(probs[pred_idx])

        shap_values_all = cls._explainer.shap_values(X_transformed)
        if isinstance(shap_values_all, list):
            current_shap_values = shap_values_all[pred_idx][0]
        else:
            current_shap_values = shap_values_all[0, :, pred_idx]

        shap_data = []
        for name, val in zip(cls._feature_names, current_shap_values):
            if abs(val) > 0.005:
                shap_data.append({
                    "feature": name, 
                    "impact": round(float(val), 4)
                })

        shap_data = sorted(shap_data, key=lambda x: abs(x['impact']), reverse=True)

        return {
            "recommended_fertilizer": recommended_fert,
            "confidence": round(confidence, 2),
            "insight_message": f"Основной фактор влияния: {shap_data[0]['feature'] if shap_data else 'сбалансированные показатели'}",
            "shap_values": shap_data
        }