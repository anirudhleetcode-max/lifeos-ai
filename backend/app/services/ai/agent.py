import os
from groq import Groq

class LifeOSAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"

    def process_prompt(self, user_prompt: str):
        system_prompt = """
        You are the LifeOS AI. You help software engineers and computer science students 
        prioritize their workloads, debug code, and understand Machine Learning concepts. 
        Keep your responses highly professional, structured, and insightful.
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=600
        )
        return {
            "ai_response": response.choices[0].message.content,
            "priority_score": True 
        }
