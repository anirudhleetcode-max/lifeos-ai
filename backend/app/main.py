from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your route files
from backend.app.api.v1 import chat, auth

app = FastAPI(title="LifeOS API")

# --- CORS Configuration ---
# This allows your specific Vercel frontend URLs to securely talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                                 # For local testing
        "https://lifeos-ai-git-main-anirudh-ed2c.vercel.app",    # Your Vercel branch URL
        "https://lifeos-1ngygk79w-anirudh-ed2c.vercel.app"       # Your Vercel deployment URL
    ],
    allow_credentials=True,
    allow_methods=["*"],                                         # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],                                         # Allows all headers (like Authorization/JSON)
)

# --- Include Routers ---
# This connects the API routes from your auth.py and chat.py files
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

# --- Health Check Endpoint ---
# A simple endpoint to verify the API is live
@app.get("/")
def read_root():
    return {"status": "success", "message": "LifeOS Backend is live and running!"}
