from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

app = FastAPI(title="Groq Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "llama-3.3-70b-versatile"

class ChatResponse(BaseModel):
    message: str
    model: str

@app.get("/")
def root():
    return {"status": "ok", "message": "Groq Chatbot API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model=request.model,
            messages=[{"role": m.role, "content": m.content} for m in request.messages],
            max_tokens=1024,
        )
        reply = completion.choices[0].message.content
        return ChatResponse(message=reply, model=request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))