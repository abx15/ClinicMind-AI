from pydantic import BaseModel
from typing import List

class TriageRequest(BaseModel):
    symptoms: List[str]
    age: int
    gender: str

class Condition(BaseModel):
    name: str
    probability: float

class TriageResponse(BaseModel):
    conditions: List[Condition]
    urgency: str  # low/medium/high/emergency
    specialization: str
    redFlags: List[str]
