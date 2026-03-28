import dns.resolver

# Apply DNS fix globally
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4']

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from app.config import connect_to_mongo

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield

app = FastAPI(title="ClinicMind AI Service", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URLS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}

# Routes will be added here
