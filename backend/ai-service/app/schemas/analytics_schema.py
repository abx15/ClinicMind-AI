from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PeakHour(BaseModel):
    hour: int
    patientCount: int

class BusyDay(BaseModel):
    date: str
    patientCount: int

class TopSpecialization(BaseModel):
    name: str
    appointmentCount: int

class DemandAnalyticsResponse(BaseModel):
    peakHours: List[PeakHour]
    busyDays: List[BusyDay]
    topSpecializations: List[TopSpecialization]
    avgPatients: float

class PlatformStatsResponse(BaseModel):
    totalHospitals: int
    totalDoctors: int
    totalPatients: int
    totalAppointments: int
    activeSubscriptions: int
    revenueThisMonth: float
