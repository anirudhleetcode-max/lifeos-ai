from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.app.db.database import get_db, TaskDB

router = APIRouter()

class TaskCreate(BaseModel):
    text: str

@router.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskDB).all()

@router.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = TaskDB(text=task.text, done=False)
    db.add(new_task)
    db.commit()
    return new_task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return {"status": "deleted"}