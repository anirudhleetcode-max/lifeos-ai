from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import litellm
import json

# Import database tools
from backend.app.db.database import get_db, TaskDB
from backend.app.services.ai.memory import save_memory, search_memory

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # 1. Save user memory
        save_memory(request.message, {"role": "user"})
        
        # 2. Give the AI "Tools" (Permissions to manage the database)
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task to the user's task manager",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_text": {"type": "string", "description": "The exact task to add"}
                        },
                        "required": ["task_text"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_tasks",
                    "description": "Read all tasks from the database to tell the user what they need to do",
                    "parameters": {"type": "object", "properties": {}}
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task from the task manager by matching its text or keywords",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_text": {"type": "string", "description": "The name or keyword of the task to delete"}
                        },
                        "required": ["task_text"]
                    }
                }
            }
        ]

        # 3. Ask the AI how it wants to respond
        response = litellm.completion(
            model="groq/llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are LifeOS, a helpful AI assistant. You can read, add, and delete tasks for the user. Be friendly and concise."},
                {"role": "user", "content": request.message}
            ],
            tools=tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message

        # 4. Process tool calls chosen by the AI
        if hasattr(response_message, 'tool_calls') and response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                # Tool: Add Task
                if function_name == "add_task":
                    new_task = TaskDB(text=args["task_text"], done=False)
                    db.add(new_task)
                    db.commit()
                    return {"reply": f"Done! I have added '{args['task_text']}' to your Task Manager."}
                
                # Tool: Get Tasks
                elif function_name == "get_tasks":
                    tasks = db.query(TaskDB).all()
                    if not tasks:
                        return {"reply": "You don't have any tasks right now! You are all caught up."}
                    else:
                        task_list = "\n".join([f"- {t.text}" for t in tasks])
                        return {"reply": f"Here is what you have on your plate:\n{task_list}"}

                # Tool: Delete Task
                elif function_name == "delete_task":
                    target_text = args.get("task_text", "").strip()
                    # Find task in DB matching keyword
                    task_to_delete = db.query(TaskDB).filter(TaskDB.text.ilike(f"%{target_text}%")).first()
                    
                    if task_to_delete:
                        deleted_name = task_to_delete.text
                        db.delete(task_to_delete)
                        db.commit()
                        return {"reply": f"Got it! I removed '{deleted_name}' from your tasks."}
                    else:
                        return {"reply": f"I couldn't find a task matching '{target_text}' to delete."}

        # 5. Normal response
        return {"reply": response_message.content or "I received your message!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))