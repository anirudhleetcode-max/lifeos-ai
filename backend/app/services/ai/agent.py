import os
from groq import Groq

class LifeOSAgent:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
    
    def process_prompt(self, user_prompt: str):
        if not self.api_key:
            return {"ai_response": "SYSTEM ERROR: Missing GROQ_API_KEY in environment."}
        try:
            client = Groq(api_key=self.api_key)
            res = client.chat.completions.create(
                model='llama-3.1-8b-instant',
                messages=[{"role": "system", "content": "You are a professional, helpful AI assistant."}, {"role": "user", "content": user_prompt}]
            )
            return {"ai_response": res.choices[0].message.content}
        except Exception as e:
            return {"ai_response": f"Backend Error: {str(e)}"}

    async def stream_prompt(self, user_prompt: str):
        if not self.api_key:
            yield "SYSTEM ERROR: Missing GROQ_API_KEY in environment."
            return
        try:
            client = Groq(api_key=self.api_key)
            stream = client.chat.completions.create(
                model='llama-3.1-8b-instant',
                messages=[{"role": "system", "content": "You are a professional, helpful AI assistant."}, {"role": "user", "content": user_prompt}],
                stream=True
            )
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            yield f"Backend Error: {str(e)}"
