import os

# Define the folder structure
folders = [
    "backend/app/api/v1",
    "backend/app/core",
    "backend/app/db",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services/ai",
]

# Define the files and their exact content
files = {
    "backend/__init__.py": "",
    "backend/app/__init__.py": "",
    "backend/app/api/__init__.py": "",
    "backend/app/api/v1/__init__.py": "",
    "backend/app/core/__init__.py": "",
    "backend/app/db/__init__.py": "",
    "backend/app/models/__init__.py": "",
    "backend/app/schemas/__init__.py": "",
    "backend/app/services/__init__.py": "",
    "backend/app/services/ai/__init__.py": "",
    
    "backend/app/main.py": """import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from backend.app.api.v1 import auth, chat
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LifeOS AI API", version="1.0.0")

# Allow Frontend to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["AI Chat & Memory"])
""",
    
    # ... (You could include all the other backend files here if you wanted a complete reset)
}

def build():
    print("Building LifeOS Architecture...")
    
    # 1. Create all folders
    for folder in folders:
        os.makedirs(folder, exist_ok=True)
        print(f"Created directory: {folder}")
        
    # 2. Create all files with content
    for filepath, content in files.items():
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Generated file: {filepath}")
        
    print("\nArchitecture successfully generated!")

if __name__ == "__main__":
    build()