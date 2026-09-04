from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
import numpy as np
import io
import json
import os

from backend.translator import translate_text
from backend.risk_engine import calculate_spoilage_risk


app = FastAPI(title="FarmIQ API")


# =========================================
# CORS
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# MODEL PATHS
# =========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "farmiq_model.keras"
)

CLASS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "class_names.json"
)


# =========================================
# LOAD MODEL
# =========================================

model = tf.keras.models.load_model(
    MODEL_PATH
)


# =========================================
# LOAD CLASS NAMES
# =========================================

with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)


# =========================================
# HOME
# =========================================

@app.get("/")
def home():
    return {
        "message": "FarmIQ API is running",
        "classes": class_names
    }


# =========================================
# PREDICTION
# =========================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),

    crop: str = Form(...),

    harvest_age: int = Form(...),

    storage: str = Form(...),

    transport_days: int = Form(...),

    language: str = Form("en")
):

    # =========================================
    # 1. READ IMAGE
    # =========================================

    contents = await file.read()

    image = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")


    # =========================================
    # 2. PREPROCESS IMAGE
    # =========================================

    image = image.resize(
        (224, 224)
    )

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    # =========================================
    # 3. MODEL PREDICTION
    # =========================================

    predictions = model.predict(
        image_array,
        verbose=0
    )[0]


    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_class = class_names[
        predicted_index
    ]

    confidence = float(
        predictions[predicted_index] * 100
    )


    # =========================================
    # 4. PROBABILITY BREAKDOWN
    # =========================================

    probability_dict = {
        class_names[i]: round(
            float(predictions[i] * 100),
            2
        )
        for i in range(len(class_names))
    }


    # =========================================
    # 5. SPOILAGE RISK ENGINE
    # =========================================

    risk_result = calculate_spoilage_risk(
        prediction=predicted_class,

        probabilities=probability_dict,

        harvest_age=harvest_age,

        storage=storage,

        transport_days=transport_days
    )


    # =========================================
    # 6. TRANSLATE RECOMMENDATION
    # =========================================

    recommendation = risk_result["recommendation"]

    try:

        translated_recommendation = translate_text(
            recommendation,
            language
        )

    except Exception as e:

        print(
            f"Translation error: {e}"
        )

        # Fallback to English
        translated_recommendation = recommendation


    # =========================================
    # 7. FINAL RESPONSE
    # =========================================

    return {

        "prediction": predicted_class,

        "confidence": round(
            confidence,
            2
        ),

        "probabilities": probability_dict,

        "batch_data": {

            "crop": crop,

            "harvest_age": harvest_age,

            "storage": storage,

            "transport_days": transport_days
        },

        "risk": {

            "spoilage_risk":
                risk_result["spoilage_risk"],

            "risk_level":
                risk_result["risk_level"],

            "recommendation":
                translated_recommendation
        }
    }