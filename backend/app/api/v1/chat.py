from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import litellm
import json
import os
from backend.app.db.database import get_db, TaskDB

# Graceful import in case memory.py has issues
try:
    from backend.app.services.ai.memory import save_memory
except ImportError:
    def save_memory(text, role):
        pass

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        save_memory(request.message, "user")
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {"reply": "⚠️ ERROR: Docker still cannot find your GROQ_API_KEY. Check your .env file."}

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a task for the user",
                    "parameters": {"type": "object", "properties": {"task_text": {"type": "string"}}, "required": ["task_text"]}
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_tasks",
                    "description": "Read current tasks",
                    "parameters": {"type": "object", "properties": {}}
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {"type": "object", "properties": {"task_text": {"type": "string"}}, "required": ["task_text"]}
                }
            }
        ]

        # THE FIX: Upgraded the model to Groq's new Llama 3.1 version!
        response = litellm.completion(
            model="groq/llama-3.1-8b-instant",
            api_key=api_key, 
            messages=[
                {"role": "system", "content": "You are LifeOS, an AI Task Agent. Manage the user's tasks."},
                {"role": "user", "content": request.message}
            ],
            tools=tools,
            tool_choice="auto"
        )
        
        msg = response.choices[0].message
        
        if hasattr(msg, 'tool_calls') and msg.tool_calls:
            for tool_call in msg.tool_calls:
                func_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                
                if func_name == "add_task":
                    db.add(TaskDB(text=args["task_text"], done=False))
                    db.commit()
                    return {"reply": f"Added '{args['task_text']}' to your tasks."}
                elif func_name == "get_tasks":
                    tasks = db.query(TaskDB).all()
                    task_list = "\n".join([f"- {t.text}" for t in tasks]) if tasks else "You have no tasks!"
                    return {"reply": f"Your tasks:\n{task_list}"}
                elif func_name == "delete_task":
                    target = args.get("task_text", "")
                    task = db.query(TaskDB).filter(TaskDB.text.ilike(f"%{target}%")).first()
                    if task:
                        db.delete(task)
                        db.commit()
                        return {"reply": f"Deleted '{task.text}'."}
                    return {"reply": "I couldn't find that task."}

        return {"reply": msg.content or "Done!"}

    except Exception as e:
        print(f"AI Error: {e}")
        return {"reply": f"⚠️ BACKEND CRASHED: {str(e)}"}