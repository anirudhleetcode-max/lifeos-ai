from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI(title="LifeOS API")

# 1. Add CORS middleware so your Next.js frontend can securely connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allows your React app to fetch data
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base route to check if the backend is alive
@app.get("/")
def read_root():
    return {"message": "LifeOS Backend is online!"}

# 2. The data endpoint our React dashboard is fetching
@app.get("/api/stats")
def get_dashboard_stats():
    return {
        "active_tasks": 42,
        "completed": 108,
        "agent_status": "Hyper-Active"
    }