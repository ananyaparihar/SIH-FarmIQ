import os
import requests
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv(
    "SARVAM_API_KEY"
)

SARVAM_URL = (
    "https://api.sarvam.ai/translate"
)


def translate_text(
    text: str,
    target_language: str
) -> str:

    if target_language == "en":
        return text

    if not SARVAM_API_KEY:
        raise RuntimeError(
            "SARVAM_API_KEY is not configured"
        )

    headers = {
        "api-subscription-key":
            SARVAM_API_KEY,

        "Content-Type":
            "application/json"
    }

    payload = {
        "input": text,

        "source_language_code":
            "en-IN",

        "target_language_code":
            "hi-IN",

        "model":
            "sarvam-translate:v1"
    }

    response = requests.post(
        SARVAM_URL,
        headers=headers,
        json=payload,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    return data["translated_text"]