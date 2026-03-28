from fastapi import APIRouter, HTTPException
from app.schemas.triage_schema import TriageRequest, TriageResponse, Condition
from app.services.gemini_service import gemini_service
import json

router = APIRouter()

@router.post("/ai/triage", response_model=TriageResponse)
async def triage_patient(request: TriageRequest):
    try:
        # Build prompt for Gemini
        symptoms_str = ", ".join(request.symptoms)
        prompt = f"""Given these symptoms: {symptoms_str} for a {request.age}y {request.gender}, provide:
1. Possible conditions (top 3) with probability estimates (0-1)
2. Urgency level: low/medium/high/emergency
3. Recommended specialization
4. Red flag symptoms to watch

Return as JSON only in this exact format:
{{
  "conditions": [
    {{"name": "condition1", "probability": 0.8}},
    {{"name": "condition2", "probability": 0.6}},
    {{"name": "condition3", "probability": 0.4}}
  ],
  "urgency": "high",
  "specialization": "Cardiology",
  "redFlags": ["severe chest pain", "difficulty breathing"]
}}"""

        response = await gemini_service.call_gemini(prompt)
        
        # Parse JSON response
        try:
            data = json.loads(response)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid AI response format")
        
        # Validate and create response
        conditions = [Condition(**cond) for cond in data.get("conditions", [])]
        
        return TriageResponse(
            conditions=conditions,
            urgency=data.get("urgency", "medium"),
            specialization=data.get("specialization", "General Practice"),
            redFlags=data.get("redFlags", [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Triage failed: {str(e)}")
