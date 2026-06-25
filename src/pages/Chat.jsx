import { useEffect, useRef, useState } from "react";

import api from "../api/api";
import Layout from "../components/Layout";
import RiskBadge from "../components/RiskBadge";
import ConversationSidebar from "../components/ConversationSidebar";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [refreshConversations, setRefreshConversations] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedConversation) loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function loadMessages() {
    try {
      const response = await api.get(`/chat/messages/${selectedConversation}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function askAI() {
    if (!message.trim()) return;

    const userId = localStorage.getItem("healthpal_user_id");
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const response = await api.post("/chat", {
            user_id: userId,
            message: currentMessage,
            conversation_id: selectedConversation,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          if (!selectedConversation) {
            setSelectedConversation(response.data.conversation_id);
            setRefreshConversations((prev) => prev + 1);
          }

          await loadMessages();
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert("Location permission is required to find nearby facilities.");
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function startNewChat() {
    setMessages([]);
    setSelectedConversation(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  }

  return (
    <Layout>
      <div className="flex h-[85vh] bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
        {/* Sidebar */}
        <ConversationSidebar
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          refreshTrigger={refreshConversations}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="border-b border-slate-100 px-5 py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="font-semibold text-slate-800 leading-tight">HealthPal AI</h1>
                <p className="text-xs text-slate-400">AI symptom analysis</p>
              </div>
            </div>
            <button
              onClick={startNewChat}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700">Describe your symptoms</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-xs">
                  Tell me what you're experiencing and I'll assess your risk and find nearby care.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

                  {/* Risk badge */}
                  {msg.role === "assistant" && msg.risk_level && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <RiskBadge risk={msg.risk_level} />
                      {msg.risk_reason && (
                        <p className="mt-2 text-sm text-slate-600">{msg.risk_reason}</p>
                      )}
                    </div>
                  )}

                  {/* Nearby facilities */}
                  {msg.role === "assistant" && msg.facilities?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Nearby Facilities
                      </p>
                      <div className="space-y-2">
                        {msg.facilities.map((facility, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-3 border border-slate-200">
                            <p className="font-semibold text-sm text-slate-800">{facility.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{facility.address}</p>
                            <a
                              href={facility.maps_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2 font-medium"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Open in Google Maps
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.created_at && (
                    <p className={`text-xs mt-2 ${msg.role === "user" ? "text-blue-200" : "text-slate-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-5 py-4 flex-shrink-0">
            <div className="flex gap-3 items-end">
              <textarea
                rows="2"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Describe your symptoms..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={askAI}
                disabled={loading || !message.trim()}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}