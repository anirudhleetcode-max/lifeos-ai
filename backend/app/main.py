from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.v1 import chat, tasks
from backend.app.db.database import engine, Base

# Create all database tables when the app starts
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LifeOS API", version="1.0.0")

# --- CORS SECURITY SETTINGS ---
# This acts as a "VIP Pass" allowing your Next.js frontend (port 3000) 
# to talk to this Python backend (port 8000) without getting blocked.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# --- REGISTER API ROUTES ---
app.include_router(chat.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")

# A simple health check route
@app.get("/")
def read_root():
    return {"message": "Welcome to the LifeOS API! The backend is running perfectly."}