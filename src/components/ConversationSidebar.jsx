import { useEffect, useState } from "react";
import api from "../api/api";

export default function ConversationSidebar({
  selectedConversation,
  setSelectedConversation,
  refreshTrigger,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [refreshTrigger]);

  async function loadConversations() {
    try {
      const userId = localStorage.getItem("healthpal_user_id");
      const response = await api.get(`/chat/conversations/${userId}`);
      setConversations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-64 flex-shrink-0 border-r border-slate-100 bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Conversations
        </h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="space-y-2 px-3 mt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 px-4 text-center">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No conversations yet. Start a new chat to begin.
            </p>
          </div>
        ) : (
          <div className="px-2 space-y-0.5">
            {conversations.map((conversation) => {
              const isActive = selectedConversation === conversation.id;
              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all group flex items-start gap-3 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-white text-slate-700 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                      isActive ? "bg-blue-500" : "bg-slate-100 group-hover:bg-slate-200"
                    }`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate leading-tight ${isActive ? "text-white" : "text-slate-700"}`}>
                      {conversation.title || "Untitled conversation"}
                    </p>
                    {conversation.created_at && (
                      <p className={`text-xs mt-0.5 truncate ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                        {new Date(conversation.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}