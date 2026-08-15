from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your route files
from backend.app.api.v1 import chat, auth

app = FastAPI(title="LifeOS API")

# --- CORS Configuration ---
# This allows your Vercel frontend to communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",             # Allows local testing during development
        "https://your-frontend.vercel.app"   # <--- REPLACE THIS WITH YOUR ACTUAL VERCEL URL!
    ],
    allow_credentials=True,
    allow_methods=["*"],                     # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],                     # Allows all headers
)

# --- Include Routers ---
# This connects the API routes from your auth.py and chat.py files
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

# --- Health Check Endpoint ---
# A simple endpoint to verify the API is live (renders when you visit the root URL)
@app.get("/")
def read_root():
    return {"status": "success", "message": "LifeOS Backend is live and running!"}
