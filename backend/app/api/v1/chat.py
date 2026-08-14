from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.ai.agent import LifeOSAgent

router = APIRouter()
agent = LifeOSAgent()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/prompt")
def handle_ai_prompt(request: PromptRequest):
    try:
        result = agent.process_prompt(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
