"use client";

import { useState, useRef, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm powered by Groq. Ask me anything ⚡" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
//Github
  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Something went wrong. Is the backend running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-[#111] border border-[#222] rounded-2xl overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[#f0f0f0] font-semibold text-sm tracking-tight">
              Groq Chat
            </span>
          </div>
          <span className="text-[10px] text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 rounded-full font-mono">
            llama-3.3-70b
          </span>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#222]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "self-end bg-orange-500 text-white rounded-br-sm"
                  : "self-start bg-[#1a1a1a] border border-[#252525] text-[#e0e0e0] flex flex-col gap-1"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                  AI
                </span>
              )}
              <p className="whitespace-pre-wrap m-0">{msg.content}</p>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="self-start max-w-[85%] px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#252525] flex flex-col gap-1">
              <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                AI
              </span>
              <div className="flex gap-1 items-center py-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-end gap-2 px-4 py-3 border-t border-[#1e1e1e]">
          <textarea
            className="flex-1 resize-none bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500 rounded-xl text-[#f0f0f0] text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder-[#444] max-h-40"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Groq..."
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-lg flex items-center justify-center transition-all duration-150"
          >
            ↑
          </button>
        </div>

      </div>
    </main>
  );
}