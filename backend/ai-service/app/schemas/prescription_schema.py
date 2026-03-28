from pydantic import BaseModel
from typing import List, Optional

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str

class Prescription(BaseModel):
    diagnosis: str
    medications: List[Medication]
    notes: Optional[str] = None

class VoiceRxResponse(BaseModel):
    transcript: str
    prescription: Prescription
