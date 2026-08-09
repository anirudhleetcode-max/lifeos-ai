from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import litellm
import json

# Import our database tools
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
        
        # 2. Give the AI "Tools" (Permissions to use the database)
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
            }
        ]

        # 3. Ask the AI how it wants to respond
        response = litellm.completion(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are LifeOS, a helpful AI assistant. You can read and manage tasks for the user. Be friendly and concise."},
                {"role": "user", "content": request.message}
            ],
            tools=tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message

        # 4. Did the AI decide to use a tool?
        if hasattr(response_message, 'tool_calls') and response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                # The AI chose to add a task!
                if function_name == "add_task":
                    new_task = TaskDB(text=args["task_text"], done=False)
                    db.add(new_task)
                    db.commit()
                    return {"reply": f"Done! I have added '{args['task_text']}' to your Task Manager."}
                
                # The AI chose to read your tasks!
                elif function_name == "get_tasks":
                    tasks = db.query(TaskDB).all()
                    if not tasks:
                        return {"reply": "You don't have any tasks right now! You are all caught up."}
                    else:
                        task_list = "\n".join([f"- {t.text} (Done: {t.done})" for t in tasks])
                        return {"reply": f"Here is what you have on your plate:\n{task_list}"}

        # 5. Normal text reply if no tools were needed
        return {"reply": response_message.content or "I received your message!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))