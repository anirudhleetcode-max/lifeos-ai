from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.services.ai.agent import LifeOSAgent
from backend.app.services.ai.rag import LifeOSRAGService
from backend.app.db.session import engine, get_db
from backend.app.models.chat import Base, ChatMessage
from jose import jwt

Base.metadata.create_all(bind=engine)
router = APIRouter()
agent = LifeOSAgent()
rag = LifeOSRAGService()

SECRET_KEY = "lifeos_super_secret_jwt_key_change_in_production"
ALGORITHM = "HS256"

class PromptRequest(BaseModel):
    prompt: str

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/history")
def get_history(user_email: str = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.user_email == user_email).order_by(ChatMessage.timestamp.asc()).all()
    return [{"role": m.role, "text": m.text} for m in messages]

@router.post("/prompt")
async def handle_prompt(req: PromptRequest, user_email: str = Depends(get_current_user), db: Session = Depends(get_db)):
    # Save user message
    user_msg = ChatMessage(user_email=user_email, role="user", text=req.prompt)
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # Index into Qdrant
    rag.add_memory(user_email, req.prompt, user_msg.id)

    # RAG Retrieval context
    context_snippets = rag.search_memory(user_email, req.prompt)
    enhanced_prompt = req.prompt
    if context_snippets:
        enhanced_prompt = f"Context from past chats: {' | '.join(context_snippets)}\n\nCurrent User Query: {req.prompt}"

    async def generate():
        full_response = ""
        async for chunk in agent.stream_prompt(enhanced_prompt):
            full_response += chunk
            yield chunk

        # Save completed AI response to PostgreSQL once streaming finishes
        ai_msg = ChatMessage(user_email=user_email, role="ai", text=full_response)
        db.add(ai_msg)
        db.commit()

    return StreamingResponse(generate(), media_type="text/event-stream")
