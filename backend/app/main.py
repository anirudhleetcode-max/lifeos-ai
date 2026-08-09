from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Import our new database setup
from backend.app.db.database import TaskDB, get_db
from backend.app.api.v1 import chat

app = FastAPI(title="LifeOS AI")

# Allow the frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep the chat route working
app.include_router(chat.router, prefix="/api/v1")

# --- NEW TASK MANAGER ROUTES ---

class TaskCreate(BaseModel):
    text: str

@app.get("/api/v1/tasks")
def get_tasks(db: Session = Depends(get_db)):
    # Fetch all tasks from the PostgreSQL database
    return db.query(TaskDB).all()

@app.post("/api/v1/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # Save a brand new task to PostgreSQL
    new_task = TaskDB(text=task.text, done=False)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/api/v1/tasks/{task_id}")
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    # Flip a task between done and not done
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()
    if task:
        task.done = not task.done
        db.commit()
        return task
    return {"error": "Task not found"}