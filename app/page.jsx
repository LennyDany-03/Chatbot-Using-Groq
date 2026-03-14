"use client";

import { useState, useRef, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
//Github
export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey — I'm powered by Groq. Ultra-fast inference, zero latency. What can I help you build today? ⚡",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Is the backend running?",
        },
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

  function handleInput(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020b18 0%, #061830 40%, #04122b 70%, #071e3d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Space Grotesk', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          top: -100,
          left: -100,
          borderRadius: "50%",
          background: "rgba(0,180,255,0.10)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 300,
          height: 300,
          bottom: -60,
          right: -60,
          borderRadius: "50%",
          background: "rgba(0,255,220,0.07)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Chat window */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          height: "min(700px, 90vh)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,200,255,0.18)",
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Scan-line animation */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
          @keyframes scan { 0% { top: 0; opacity: 0.7; } 100% { top: 100%; opacity: 0; } }
          @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.45; transform:scale(0.8); } }
          @keyframes bounce { 0%,80%,100% { transform:translateY(0); opacity:0.4; } 40% { transform:translateY(-5px); opacity:1; } }
          .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(0,200,255,0.45), transparent); animation: scan 5s linear infinite; pointer-events: none; z-index: 10; }
          .messages::-webkit-scrollbar { width: 4px; }
          .messages::-webkit-scrollbar-track { background: transparent; }
          .messages::-webkit-scrollbar-thumb { background: rgba(0,200,255,0.15); border-radius: 4px; }
          .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(0,200,255,0.5); display: inline-block; margin: 0 2px; animation: bounce 1.2s ease-in-out infinite; }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }
          .send-btn:hover { background: rgba(0,180,255,0.32) !important; border-color: rgba(0,220,255,0.6) !important; }
          .send-btn:active { transform: scale(0.93); }
          .textarea-wrap:focus-within { border-color: rgba(0,200,255,0.45) !important; }
        `}</style>
        <div className="scan-line" />

        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(0,200,255,0.12)",
            background: "rgba(0,180,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: "rgba(0,200,255,0.1)",
                border: "1px solid rgba(0,200,255,0.28)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5" stroke="#00d4ff" strokeWidth="1.2" />
                <path d="M5 8h6M8 5v6" stroke="#00d4ff" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e0f7ff",
                  letterSpacing: "0.01em",
                }}
              >
                Groq Chat
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(100,220,255,0.55)",
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 1,
                }}
              >
                neural interface // active
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(0,220,255,0.65)",
              background: "rgba(0,200,255,0.07)",
              border: "1px solid rgba(0,200,255,0.2)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "#00e5ff",
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            llama-3.3-70b
          </div>
        </div>

        {/* Messages */}
        <div
          className="messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Session divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              color: "rgba(0,200,255,0.28)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ flex: 1, height: 1, background: "rgba(0,200,255,0.1)" }} />
            session init
            <span style={{ flex: 1, height: 1, background: "rgba(0,200,255,0.1)" }} />
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  background:
                    msg.role === "assistant"
                      ? "rgba(0,200,255,0.1)"
                      : "rgba(30,130,255,0.18)",
                  border:
                    msg.role === "assistant"
                      ? "1px solid rgba(0,200,255,0.25)"
                      : "1px solid rgba(30,130,255,0.35)",
                  color: msg.role === "assistant" ? "#00d4ff" : "#80baff",
                }}
              >
                {msg.role === "assistant" ? "AI" : "ME"}
              </div>

              <div>
                {msg.role === "assistant" && (
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(0,220,255,0.45)",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: 4,
                    }}
                  >
                    Groq
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "min(75%, 460px)",
                    padding: "10px 14px",
                    borderRadius: 14,
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    ...(msg.role === "user"
                      ? {
                          background: "rgba(30,120,255,0.2)",
                          border: "1px solid rgba(50,140,255,0.3)",
                          color: "#dceeff",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "rgba(0,180,255,0.07)",
                          border: "1px solid rgba(0,200,255,0.13)",
                          color: "#c8eeff",
                          borderBottomLeftRadius: 4,
                        }),
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  background: "rgba(0,200,255,0.1)",
                  border: "1px solid rgba(0,200,255,0.25)",
                  color: "#00d4ff",
                }}
              >
                AI
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(0,220,255,0.45)",
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: 4,
                  }}
                >
                  Groq
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 14,
                    borderBottomLeftRadius: 4,
                    background: "rgba(0,180,255,0.07)",
                    border: "1px solid rgba(0,200,255,0.13)",
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(0,200,255,0.1)",
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            className="textarea-wrap"
            style={{
              flex: 1,
              background: "rgba(0,180,255,0.05)",
              border: "1px solid rgba(0,200,255,0.18)",
              borderRadius: 12,
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              placeholder="Send a message..."
              style={{
                width: "100%",
                background: "none",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13.5,
                color: "#d0eeff",
                lineHeight: 1.5,
                display: "block",
              }}
            />
          </div>

          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              background: "rgba(0,180,255,0.16)",
              border: "1px solid rgba(0,200,255,0.35)",
              borderRadius: 10,
              color: "#00d4ff",
              fontSize: 17,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              opacity: loading || !input.trim() ? 0.3 : 1,
            }}
          >
            ↑
          </button>
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: "7px 20px",
            fontSize: 10,
            color: "rgba(0,200,255,0.22)",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
            letterSpacing: "0.04em",
            borderTop: "1px solid rgba(0,200,255,0.06)",
            background: "rgba(0,0,0,0.1)",
            flexShrink: 0,
          }}
        >
          enter to send &nbsp;·&nbsp; shift+enter for newline
        </div>
      </div>
    </main>
  );
}