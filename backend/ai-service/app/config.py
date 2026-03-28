import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URL", "")
MONGO_URI_FALLBACK = os.getenv("MONGO_URI_FALLBACK", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

client = None
db = None

async def connect_to_mongo():
    global client, db
    MAX_RETRIES = 3
    retries = 0

    while retries < MAX_RETRIES:
        try:
            print(f"Attempting MongoDB connection... (Attempt {retries + 1}/{MAX_RETRIES})")
            client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            await client.admin.command('ping')
            db = client["clinicmind"]
            print("MongoDB connected successfully via Primary URI (SRV)")
            return
        except Exception as e:
            print(f"MongoDB Primary connection failed: {e}")
            
            try:
                print("Attempting connection via Fallback URI...")
                client = AsyncIOMotorClient(MONGO_URI_FALLBACK, serverSelectionTimeoutMS=5000)
                await client.admin.command('ping')
                db = client["clinicmind"]
                print("MongoDB connected successfully via Fallback URI")
                return
            except Exception as fallbackError:
                print(f"MongoDB Fallback connection failed: {fallbackError}")
            
            retries += 1
            if retries < MAX_RETRIES:
                print("Waiting 5 seconds before retrying...")
                await asyncio.sleep(5)

    print("All MongoDB connection attempts failed. Proceeding without active DB connection.")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["clinicmind"]
