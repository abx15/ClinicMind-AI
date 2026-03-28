from fastapi import APIRouter, HTTPException, Query, Header
from app.schemas.analytics_schema import DemandAnalyticsResponse, PlatformStatsResponse, PeakHour, BusyDay, TopSpecialization
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from collections import defaultdict, Counter
from typing import Optional

router = APIRouter()

async def get_db():
    """Get MongoDB database connection"""
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    return client.clinicmind

@router.get("/ai/analytics/demand", response_model=DemandAnalyticsResponse)
async def get_demand_analytics(
    hospitalId: str = Query(...),
    days: int = Query(30, ge=1, le=365)
):
    try:
        db = await get_db()
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Fetch appointments for this hospital
        appointments = await db.appointments.find({
            "hospitalId": hospitalId,
            "date": {"$gte": start_date, "$lte": end_date},
            "status": "completed"
        }).to_list(length=None)
        
        if not appointments:
            return DemandAnalyticsResponse(
                peakHours=[],
                busyDays=[],
                topSpecializations=[],
                avgPatients=0.0
            )
        
        # Analyze peak hours
        hour_counts = Counter()
        for apt in appointments:
            if "date" in apt:
                hour = apt["date"].hour
                hour_counts[hour] += 1
        
        peak_hours = [
            PeakHour(hour=hour, patientCount=count)
            for hour, count in hour_counts.most_common(5)
        ]
        
        # Analyze busy days
        day_counts = defaultdict(int)
        for apt in appointments:
            if "date" in apt:
                date_str = apt["date"].strftime("%Y-%m-%d")
                day_counts[date_str] += 1
        
        busy_days = [
            BusyDay(date=date, patientCount=count)
            for date, count in sorted(day_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Analyze specializations
        spec_counts = Counter()
        for apt in appointments:
            if "specialization" in apt:
                spec_counts[apt["specialization"]] += 1
        
        top_specializations = [
            TopSpecialization(name=spec, appointmentCount=count)
            for spec, count in spec_counts.most_common(10)
        ]
        
        # Calculate average patients per day
        avg_patients = len(appointments) / days
        
        return DemandAnalyticsResponse(
            peakHours=peak_hours,
            busyDays=busy_days,
            topSpecializations=top_specializations,
            avgPatients=round(avg_patients, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demand analytics failed: {str(e)}")

@router.get("/ai/analytics/platform", response_model=PlatformStatsResponse)
async def get_platform_analytics(x_user_role: Optional[str] = Header(None)):
    try:
        # Verify superadmin role
        if x_user_role != "superadmin":
            raise HTTPException(status_code=403, detail="Superadmin access required")
        
        db = await get_db()
        
        # Get platform-level statistics
        total_hospitals = await db.hospitals.count_documents({})
        total_doctors = await db.doctors.count_documents({})
        total_patients = await db.patients.count_documents({})
        total_appointments = await db.appointments.count_documents({})
        
        # Active subscriptions (excluding expired)
        active_subscriptions = await db.subscriptions.count_documents({
            "status": {"$in": ["active", "trial"]}
        })
        
        # Revenue calculation (mock for now - would integrate with Razorpay)
        revenue_this_month = 0.0
        
        return PlatformStatsResponse(
            totalHospitals=total_hospitals,
            totalDoctors=total_doctors,
            totalPatients=total_patients,
            totalAppointments=total_appointments,
            activeSubscriptions=active_subscriptions,
            revenueThisMonth=revenue_this_month
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Platform analytics failed: {str(e)}")
