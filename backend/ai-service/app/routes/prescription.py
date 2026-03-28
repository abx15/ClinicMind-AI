from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.prescription_schema import VoiceRxResponse, Prescription, Medication
from app.services.gemini_service import gemini_service
from app.services.whisper_service import whisper_service
import json
import os
import tempfile
import uuid

router = APIRouter()

@router.post("/ai/prescription/voice", response_model=VoiceRxResponse)
async def voice_prescription(audio: UploadFile = File(...)):
    try:
        # Validate audio file type
        if not audio.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Transcribe audio using Whisper
            transcript = await whisper_service.transcribe_audio(temp_file_path)
            
            # Build prompt for Gemini
            prompt = f"""Extract prescription from this doctor's dictation: "{transcript}"
            
Return JSON only in this exact format:
{{
  "diagnosis": "patient diagnosis",
  "medications": [
    {{
      "name": "medication name",
      "dosage": "5mg",
      "frequency": "twice daily",
      "duration": "7 days",
      "instructions": "take after food"
    }}
  ],
  "notes": "additional notes"
}}"""

            response = await gemini_service.call_gemini(prompt)
            
            # Parse JSON response
            try:
                data = json.loads(response)
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail="Invalid AI response format")
            
            # Create structured prescription
            medications = [Medication(**med) for med in data.get("medications", [])]
            
            prescription = Prescription(
                diagnosis=data.get("diagnosis", ""),
                medications=medications,
                notes=data.get("notes")
            )
            
            return VoiceRxResponse(
                transcript=transcript,
                prescription=prescription
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice prescription failed: {str(e)}")
