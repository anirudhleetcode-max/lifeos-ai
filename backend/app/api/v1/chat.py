from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
import litellm
import json
import os
import time
import datetime
from textblob import TextBlob
from qdrant_client import QdrantClient
from backend.app.db.database import get_db, TaskDB

router = APIRouter()

try:
    qdrant = QdrantClient(host="qdrant", port=6333)
    qdrant.set_model("sentence-transformers/all-MiniLM-L6-v2")
except Exception:
    qdrant = None

class ChatRequest(BaseModel):
    message: str

def process_ai_logic(user_text: str, db: Session, is_system_ping: bool = False):
    api_key = os.getenv("GROQ_API_KEY")
    telemetry_nodes = [
        {"id": "intent", "label": "Intent & Sentiment", "status": "pending", "detail": "Waiting for input"},
        {"id": "rag", "label": "Qdrant Vector Memory", "status": "pending", "detail": "Idle"},
        {"id": "dag", "label": "Multi-Agent DAG", "status": "pending", "detail": "Idle"},
        {"id": "db", "label": "PostgreSQL Sync", "status": "pending", "detail": "Idle"}
    ]

    current_time = datetime.datetime.now().strftime("%B %d, %Y, %I:%M %p")
    location = "Rajamahendravaram, Andhra Pradesh, India"

    # Step 1: Intent & Sentiment Analysis
    telemetry_nodes[0]["status"] = "active"
    sentiment_score = TextBlob(user_text).sentiment.polarity
    mood_context = "neutral"
    if sentiment_score < -0.2:
        mood_context = "stressed. Be empathetic, optimistic, and sequence gently."
    elif sentiment_score > 0.3:
        mood_context = "energetic. Match momentum."
    telemetry_nodes[0]["status"] = "completed"
    telemetry_nodes[0]["detail"] = f"Polarity: {sentiment_score:.2f} ({mood_context})"

    # Step 2: RAG Vector Memory Query
    telemetry_nodes[1]["status"] = "active"
    memory_context = ""
    if qdrant and not is_system_ping:
        try:
            qdrant.add(collection_name="memories", documents=[user_text])
            results = qdrant.query(collection_name="memories", query_text=user_text, limit=1)
            if results:
                memory_context = f"Behavioral Memory: {results[0].document}"
                telemetry_nodes[1]["detail"] = "Matched past context"
            else:
                telemetry_nodes[1]["detail"] = "Indexed new memory"
        except Exception:
            telemetry_nodes[1]["detail"] = "Skipped (Offline)"
    else:
        telemetry_nodes[1]["detail"] = "System Ping Bypass"
    telemetry_nodes[1]["status"] = "completed"

    # Step 3: Multi-Agent DAG Compilation
    telemetry_nodes[2]["status"] = "active"
    system_prompt = f"""You are LifeOS, an elite AI Systems Architect. 
    Current Time: {current_time}
    User Location: {location}
    User state: {mood_context}
    {memory_context}
    
    CRITICAL ARCHITECTURE RULE (DAG EXECUTION):
    When given a request, analyze logical dependencies and time requirements. 
    Use the 'create_task_dag' tool to output an ordered execution graph containing step numbers, 
    clear task names, time estimates (e.g. "Est: 45m"), categories, urgency, and dependencies."""
    
    dag_tools = [
        {
            "type": "function",
            "function": {
                "name": "create_task_dag",
                "description": "Deconstructs complex user requests into an ordered sequence of dependent tasks with time estimates.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "tasks": {
                            "type": "array",
                            "description": "A chronologically optimized sequence of tasks.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "step_number": {"type": "integer", "description": "1, 2, 3 sequence order."},
                                    "task_text": {"type": "string", "description": "Task name with duration e.g. 'Debug sorting algorithms (Est: 45m)'"},
                                    "category": {"type": "string", "enum": ["Study", "Coding", "Health", "General"]},
                                    "urgency": {"type": "integer", "description": "1 to 5 scale"},
                                    "depends_on": {"type": "integer", "description": "The step_number required before this starts (0 if root task)"}
                                },
                                "required": ["step_number", "task_text", "category", "urgency", "depends_on"]
                            }
                        }
                    },
                    "required": ["tasks"]
                }
            }
        }
    ]

    response = litellm.completion(
        model="groq/llama-3.1-8b-instant",
        api_key=api_key, 
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_text}],
        tools=dag_tools, tool_choice="auto"
    )
    msg = response.choices[0].message
    telemetry_nodes[2]["status"] = "completed"
    telemetry_nodes[2]["detail"] = "DAG compiled successfully"

    # Step 4: PostgreSQL Sync & Database Commit
    telemetry_nodes[3]["status"] = "active"
    actions_taken = []
    if hasattr(msg, 'tool_calls') and msg.tool_calls:
        for tool_call in msg.tool_calls:
            if tool_call.function.name == "create_task_dag":
                args = json.loads(tool_call.function.arguments)
                tasks_list = args.get("tasks", [])
                
                for item in tasks_list:
                    formatted_text = f"{item['task_text']}"
                    new_task = TaskDB(
                        text=formatted_text,
                        category=item.get("category", "General"),
                        urgency=item.get("urgency", 1)
                    )
                    db.add(new_task)
                    actions_taken.append(f"Step {item['step_number']}: {item['task_text']}")
        db.commit()
        telemetry_nodes[3]["detail"] = f"Committed {len(actions_taken)} rows to DB"
    else:
        telemetry_nodes[3]["detail"] = "No mutations required"
    telemetry_nodes[3]["status"] = "completed"

    if actions_taken and not msg.content:
        return "I've structured your execution roadmap and calculated time estimates:\n" + "\n".join(actions_taken), telemetry_nodes

    return msg.content or "Queue optimized successfully.", telemetry_nodes

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    is_ping = "[SYSTEM NOTIFICATION]" in request.message
    reply, telemetry = process_ai_logic(request.message, db, is_system_ping=is_ping)
    return {"reply": reply, "telemetry": telemetry}

@router.put("/tasks/{task_id}/complete")
async def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()
    if task:
        task.done = True
        task.completed_at = datetime.datetime.utcnow()
        db.commit()
        
        time_taken = (task.completed_at - task.created_at).total_seconds() / 3600
        if qdrant:
            behavior_log = f"User completed {task.category} task ('{task.text}') in {time_taken:.1f} hours."
            try:
                qdrant.add(collection_name="memories", documents=[behavior_log])
            except: pass
            
        return {"status": "success", "task": task.text}
    return {"status": "error"}

@router.post("/audio")
async def audio_endpoint(audio: UploadFile = File(...), db: Session = Depends(get_db)):
    api_key = os.getenv("GROQ_API_KEY")
    temp_file = f"temp_{audio.filename}"
    with open(temp_file, "wb") as f: f.write(await audio.read())
        
    with open(temp_file, "rb") as f:
        transcription = litellm.transcription(model="groq/whisper-large-v3", file=f, api_key=api_key)
        
    os.remove(temp_file)
    reply, telemetry = process_ai_logic(transcription.text, db)
    return {"reply": reply, "transcribed": transcription.text, "telemetry": telemetry}