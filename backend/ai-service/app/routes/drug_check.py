from fastapi import APIRouter, HTTPException
from app.schemas.drug_schema import DrugCheckRequest, DrugCheckResponse, DrugInteraction
from app.services.gemini_service import gemini_service
import json
import os
from itertools import combinations

router = APIRouter()

def load_local_interactions():
    """Load local drug interactions database"""
    try:
        file_path = os.path.join(os.path.dirname(__file__), "..", "data", "drug_interactions.json")
        with open(file_path, 'r') as f:
            data = json.load(f)
        return data["interactions"]
    except Exception:
        return []

@router.post("/ai/drug-check", response_model=DrugCheckResponse)
async def check_drug_interactions(request: DrugCheckRequest):
    try:
        interactions = []
        local_db = load_local_interactions()
        
        # Check all combinations of medications
        if len(request.medications) >= 2:
            for med1, med2 in combinations(request.medications, 2):
                # Check local database first
                local_match = None
                for interaction in local_db:
                    drugs = interaction["drugs"]
                    if (med1.lower() in drugs[0].lower() or med1.lower() in drugs[1].lower()) and \
                       (med2.lower() in drugs[0].lower() or med2.lower() in drugs[1].lower()):
                        local_match = interaction
                        break
                
                if local_match:
                    interactions.append(DrugInteraction(
                        drugs=[med1, med2],
                        severity=local_match["severity"],
                        description=local_match["description"],
                        recommendation=local_match["recommendation"]
                    ))
                else:
                    # Use Gemini for unknown combinations
                    try:
                        prompt = f"""Check drug interactions between: {med1} and {med2}.
                        
Return JSON only in this exact format:
{{
  "severity": "none/mild/moderate/severe",
  "description": "brief description of interaction",
  "recommendation": "clinical recommendation"
}}"""

                        response = await gemini_service.call_gemini(prompt)
                        data = json.loads(response)
                        
                        if data.get("severity") != "none":
                            interactions.append(DrugInteraction(
                                drugs=[med1, med2],
                                severity=data["severity"],
                                description=data["description"],
                                recommendation=data["recommendation"]
                            ))
                    except Exception:
                        # Skip if Gemini fails for this combination
                        continue
        
        return DrugCheckResponse(interactions=interactions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drug check failed: {str(e)}")
