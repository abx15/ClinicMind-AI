from openai import OpenAI
import os
import asyncio
from typing import Optional

class WhisperService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        self.client = OpenAI(api_key=api_key)
    
    async def transcribe_audio(self, file_path: str) -> str:
        """Transcribe audio file using OpenAI Whisper API"""
        try:
            with open(file_path, "rb") as audio_file:
                transcript = await asyncio.to_thread(
                    self.client.audio.transcriptions.create,
                    model="whisper-1",
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")

whisper_service = WhisperService()
