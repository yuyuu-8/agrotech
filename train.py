import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder

df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'extended_train.csv'))

numeric_features = ['Temperature', 'Humidity', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorus', 'pH_Level', 'Rainfall']
categorical_features = ['Soil Type', 'Crop Type', 'Previous_Crop', 'Season', 'Field_Orientation']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

target_le = LabelEncoder()
y = target_le.fit_transform(df['Fertilizer Name'])
X = df.drop('Fertilizer Name', axis=1)

model = xgb.XGBClassifier(objective='multi:softmax', num_class=len(target_le.classes_))
X_transformed = preprocessor.fit_transform(X)
model.fit(X_transformed, y)

joblib.dump(preprocessor, 'preprocessor.joblib')
joblib.dump(target_le, 'target_le.joblib')
model.save_model("model.json")