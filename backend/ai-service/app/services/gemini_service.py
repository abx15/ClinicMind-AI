import google.generativeai as genai
import os
import asyncio
from typing import Optional
import re

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def call_gemini(self, prompt: str, max_retries: int = 3) -> str:
        """Call Gemini API with retry logic for rate limits"""
        for attempt in range(max_retries):
            try:
                response = await asyncio.to_thread(
                    self.model.generate_content, prompt
                )
                text = response.text
                
                # Strip markdown code blocks if present
                text = re.sub(r'```json\s*', '', text)
                text = re.sub(r'```\s*', '', text)
                text = text.strip()
                
                return text
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                # Exponential backoff
                await asyncio.sleep(2 ** attempt)
        
        raise Exception("Max retries exceeded")

gemini_service = GeminiService()
