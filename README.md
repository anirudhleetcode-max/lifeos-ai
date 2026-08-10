# 🧠 LifeOS - Agentic AI Task Manager

LifeOS is a full-stack, AI-powered task management platform. Unlike standard chatbots, LifeOS features an **Agentic AI** capable of reasoning through user prompts and autonomously executing CRUD operations on a PostgreSQL database using function calling.

## 🚀 Key Features

* **Agentic Function Calling:** Powered by Groq and Llama 3.1, the AI parses natural language to automatically add, read, and delete tasks from the database.
* **Semantic Memory Ready:** Integrated with Qdrant Vector Database for long-term AI memory and Retrieval-Augmented Generation (RAG).
* **Modern Frontend UI:** A responsive, real-time React/Next.js interface with dedicated tabs for chat and manual task management.
* **Fully Containerized:** The entire backend ecosystem (API, Relational DB, Vector DB) is orchestrated using Docker Compose.

## 💻 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Python, FastAPI, SQLAlchemy, LiteLLM
* **Databases:** PostgreSQL (Relational), Qdrant (Vector)
* **AI Provider:** Groq (Llama 3.1 8B Instant)
* **DevOps:** Docker, Docker Compose

## 🛠️ Local Setup Instructions

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/your-username/lifeos-ai.git
cd lifeos-ai
\`\`\`

**2. Configure Environment Variables**
Create a \`.env\` file in the root directory and add your Groq API key:
\`\`\`text
GROQ_API_KEY=your_api_key_here
\`\`\`

**3. Launch the Backend Ecosystem**
Start the FastAPI server, PostgreSQL database, and Qdrant vector database:
\`\`\`bash
docker-compose up -d --build
\`\`\`
*The backend API will be available at \`http://localhost:8000/docs\`*

**4. Start the Frontend**
Open a new terminal, navigate to the frontend folder, and start the Next.js server:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*The UI will be available at \`http://localhost:3000\`*

## 🤖 Example AI Prompts to Try
* *"I have a massive project submission tonight. Can you suggest two things I should do to prepare and add them to my tasks?"*
* *"What do I currently have on my plate?"*
* *"I finished my project! Can you delete that task for me?"*