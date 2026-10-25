# FarmIQ – AI Produce Freshness Inspection

FarmIQ lets anyone check how fresh a piece of produce is. Upload a photo (from a phone or a computer) and the app tells you whether it is **fresh**, **mild** (starting to go bad) or **rotten**.

**Live demo:** https://farmiq-frontend-glz5.onrender.com/

> Note: the demo runs on a free Render plan, so the first request may take a few seconds while the server wakes up.


## Why this project

Produce spoils quickly after harvest, and judging freshness by eye is slow and inconsistent. FarmIQ was built for Smart India Hackathon problem statement PS193 (Smart Post-Harvest Produce Intelligence System) to show how a trained image model can give a quick, consistent freshness check.

## How it works

1. The user uploads a photo of the produce in the web app.
2. The frontend sends the image to the backend API.
3. The backend resizes and normalizes the image, then runs it through the trained model.
4. The model returns one of three freshness classes, and the app shows the result.

## Model

- **Architecture:** MobileNetV2 with transfer learning (TensorFlow / Keras)
- **Task:** 3-class image classification: `fresh`, `mild`, `rotten`
- **Dataset:** [FruQ-DB](https://zenodo.org/) (CC-BY-4.0)
- **Training:** Google Colab (GPU)
- **Test accuracy:** 93.81% on a held-out test set

## Tech stack

| Part | Technology |
| --- | --- |
| Model | Python, TensorFlow / Keras, MobileNetV2 |
| Backend | FastAPI (`/predict` endpoint) |
| Frontend | Web app in the `frontend/` folder |
| Deployment | Render (Python 3.12) |

## Project structure

```
SIH-FarmIQ/
├── backend/        # FastAPI app and trained model
├── frontend/       # Web interface for uploading photos
├── requirement.txt # Python dependencies
└── runtime.txt     # Python version for Render
```

## Run it locally

**Backend**

```bash
git clone https://github.com/ananyaparihar/SIH-FarmIQ.git
cd SIH-FarmIQ
pip install -r requirement.txt
cd backend
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Open `http://127.0.0.1:8000/docs` to try the `/predict` endpoint in the browser.

**Frontend**

```bash
cd frontend
# add your frontend start command here, e.g. npm install && npm run dev
```

## API

`POST /predict`: send an image file and get the predicted freshness class back.

## Planned work

- Fair-price prediction for produce based on its freshness grade, using Agmarknet mandi price data (data.gov.in)
- Hindi and English language support

## Author

Ananya Parihar: [GitHub](https://github.com/ananyaparihar) | [LinkedIn](https://www.linkedin.com/in/ananya-parihar-ab5633378/)
