# Groq Chatbot — FastAPI + Next.js

A simple full-stack AI chatbot using Groq's ultra-fast LLM API.

---

## Project Structure

```
groq-chatbot/
├── backend/
│   ├── main.py            # FastAPI app
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── layout.js
    │   ├── page.js        # Chat UI
    │   └── page.module.css
    ├── package.json
    └── .env.local.example
```

---

## Backend Setup (FastAPI)

```bash
cd backend

# Create virtualenv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn main:app --reload
# → http://localhost:8000
```

Get your free Groq API key at: https://console.groq.com

---

## Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Run dev server
npm run dev
# → http://localhost:3000
```

---

## API Reference

### POST /chat

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "llama-3.3-70b-versatile"
}
```

**Response:**
```json
{
  "message": "Hi! How can I help you?",
  "model": "llama-3.3-70b-versatile"
}
```

---

## Available Groq Models

| Model | Speed |
|---|---|
| `llama-3.3-70b-versatile` | Fast, smart (default) |
| `llama-3.1-8b-instant` | Fastest |
| `mixtral-8x7b-32768` | Large context |