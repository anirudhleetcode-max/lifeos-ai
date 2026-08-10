# ✨ LifeOS - Multi-Modal Agentic Task Orchestrator

LifeOS is an advanced, autonomous AI Co-Pilot designed to reduce cognitive load. Moving beyond simple LLM API wrappers, this project implements a Multi-Agent architecture with real-time NLP, Audio processing, and Vector-based semantic memory.

## 🧠 Advanced ML Architecture (IIT Internship Focus)

1. **Multi-Agent Task Decomposition:** Massive user goals are autonomously intercepted, decomposed into micro-tasks, and pushed to PostgreSQL using structured Function Calling.
2. **Zero-Shot NLP Categorization:** The AI dynamically infers the domain (Health, Coding, Admin) and assigns a priority score (1-5) without explicit user tagging.
3. **Sentiment-Aware Prompting:** The system uses `TextBlob` to run real-time sentiment analysis on user input. If high stress is detected, the AI's internal system prompt dynamically shifts to reduce cognitive load and prioritize high-urgency items.
4. **Multi-Modal Audio (Whisper):** Integrates OpenAI's Whisper model (via Groq) to allow seamless voice-to-text task generation.
5. **RAG Semantic Memory:** Pre-configured with Qdrant Vector DB and `fastembed` for localized vector embeddings, allowing the AI to recall past contexts using Cosine Similarity.

## 💻 Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS, Framer Motion (Physics-based UI)
* **Backend:** Python, FastAPI, SQLAlchemy, TextBlob, LiteLLM
* **Databases:** PostgreSQL (Relational), Qdrant (Vector)
* **AI Provider:** Groq (Llama 3.1 8B & Whisper Large v3)
* **DevOps:** Docker Compose

## 🚀 Quick Start
\`\`\`bash
# 1. Add your GROQ_API_KEY to the .env file
# 2. Start the backend ecosystem (Postgres, Qdrant, FastAPI)
docker-compose up -d --build

# 3. Start the frontend
cd frontend
npm install
npm run dev
\`\`\`