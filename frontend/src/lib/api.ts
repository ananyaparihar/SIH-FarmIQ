const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000";


/* =========================================
   API RESPONSE
========================================= */

export interface PredictResponse {

  prediction: string;

  confidence: number;

  probabilities: Record<
    string,
    number
  >;

  batch_data: {

    crop: string;

    harvest_age: number;

    storage: string;

    transport_days: number;
  };

  risk: {

    spoilage_risk: number;

    risk_level:
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "UNFIT";

    recommendation: string;
  };
}


/* =========================================
   API INPUT
========================================= */

export interface PredictInput {

  file: File;

  crop: string;

  harvestAge: number;

  storage: string;

  transportDays: number;

  language: "en" | "hi";
}


/* =========================================
   PREDICT PRODUCE
========================================= */

export async function predictProduce(
  input: PredictInput
): Promise<PredictResponse> {

  const formData = new FormData();


  // Image
  formData.append(
    "file",
    input.file
  );


  // Crop
  formData.append(
    "crop",
    input.crop
  );


  // Harvest age
  formData.append(
    "harvest_age",
    String(input.harvestAge)
  );


  // Storage
  formData.append(
    "storage",
    input.storage
  );


  // Transport duration
  formData.append(
    "transport_days",
    String(input.transportDays)
  );


  // Language
  formData.append(
    "language",
    input.language
  );


  // Send request
  const response = await fetch(
    `${API_BASE}/predict`,
    {
      method: "POST",

      body: formData
    }
  );


  // Handle error
  if (!response.ok) {

    throw new Error(
      `Prediction request failed with status ${response.status}`
    );
  }


  // Return API response
  return (
    await response.json()
  ) as PredictResponse;
}