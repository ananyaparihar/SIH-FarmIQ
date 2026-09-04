def calculate_spoilage_risk(
    prediction: str,
    probabilities: dict,
    harvest_age: int,
    storage: str,
    transport_days: int
):
    """
    FarmIQ prototype spoilage-risk engine.

    The vision model determines the current produce condition.
    Farm conditions are then used to estimate future spoilage risk.

    IMPORTANT:
    Already-rotten produce is handled by a safety gate and is
    never recommended for sale.
    """

    # =========================================
    # 1. SAFETY GATE
    # =========================================

    if prediction.strip().lower() == "rotten":

        return {
            "spoilage_risk": 100.0,
            "risk_level": "UNFIT",
            "recommendation": (
                "DO NOT SELL. Separate the affected produce "
                "from healthy produce and follow appropriate "
                "waste, composting, or disposal practices."
            )
        }

    # =========================================
    # 2. VISUAL RISK
    # =========================================

    fresh = probabilities.get("Fresh", 0) / 100
    mild = probabilities.get("Mild", 0) / 100
    rotten = probabilities.get("Rotten", 0) / 100

    visual_risk = (
        rotten * 1.0 +
        mild * 0.5
    )

    # =========================================
    # 3. HARVEST AGE RISK
    # =========================================

    if harvest_age <= 2:
        age_risk = 0.10

    elif harvest_age <= 4:
        age_risk = 0.25

    elif harvest_age <= 7:
        age_risk = 0.50

    else:
        age_risk = 0.75

    # =========================================
    # 4. STORAGE RISK
    # =========================================

    storage_lower = storage.strip().lower()

    if storage_lower in [
        "cold storage",
        "refrigerated"
    ]:
        storage_risk = 0.10

    elif storage_lower == "covered room":
        storage_risk = 0.30

    else:
        storage_risk = 0.60

    # =========================================
    # 5. TRANSPORT RISK
    # =========================================

    if transport_days <= 1:
        transport_risk = 0.10

    elif transport_days <= 2:
        transport_risk = 0.30

    elif transport_days <= 4:
        transport_risk = 0.50

    else:
        transport_risk = 0.75

    # =========================================
    # 6. COMBINE FACTORS
    # =========================================

    risk = (
        visual_risk * 0.50 +
        age_risk * 0.20 +
        storage_risk * 0.15 +
        transport_risk * 0.15
    )

    risk_percentage = round(
        min(risk * 100, 100),
        2
    )

    # =========================================
    # 7. RISK LEVEL
    # =========================================

    if risk_percentage >= 60:

        risk_level = "HIGH"

    elif risk_percentage >= 30:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    # =========================================
    # 8. RECOMMENDATION
    # =========================================

    if risk_level == "HIGH":

        recommendation = (
            "SELL FIRST. Avoid prolonged storage. "
            "Prefer a nearby market or processing."
        )

    elif risk_level == "MEDIUM":

        recommendation = (
            "PRIORITIZE FOR SALE. Monitor the batch "
            "closely and avoid unnecessary storage."
        )

    else:

        recommendation = (
            "NORMAL SALE. Current conditions indicate "
            "relatively low spoilage risk."
        )

    return {
        "spoilage_risk": risk_percentage,
        "risk_level": risk_level,
        "recommendation": recommendation
    }