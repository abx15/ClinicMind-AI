from pydantic import BaseModel
from typing import List

class DrugCheckRequest(BaseModel):
    medications: List[str]

class DrugInteraction(BaseModel):
    drugs: List[str]  # [drug1, drug2]
    severity: str  # none/mild/moderate/severe
    description: str
    recommendation: str

class DrugCheckResponse(BaseModel):
    interactions: List[DrugInteraction]
