import { useEffect, useState } from "react";
import api from "../api/api";

export default function ConversationSidebar({
  selectedConversation,
  setSelectedConversation,
  refreshTrigger
}) {

  const [conversations, setConversations] =
    useState([]);

  useEffect(() => {

    loadConversations();

  }, [refreshTrigger]);

  async function loadConversations() {

    try {

      const userId =
        localStorage.getItem(
          "healthpal_user_id"
        );

      const response =
        await api.get(
          `/chat/conversations/${userId}`
        );

      setConversations(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  }

  return (

    <div className="w-72 border-r bg-white">

      <div className="p-4 border-b">

        <h2 className="font-bold text-lg">
          Conversations
        </h2>

      </div>

      <div className="overflow-y-auto h-full">

        {
          conversations.map(
            (conversation) => (

              <div
                key={conversation.id}
                onClick={() =>
                  setSelectedConversation(
                    conversation.id
                  )
                }
                className={`p-4 cursor-pointer border-b hover:bg-slate-100 ${
                  selectedConversation ===
                  conversation.id
                    ? "bg-slate-200"
                    : ""
                }`}
              >

                <p>
                  {conversation.title}
                </p>

              </div>

            )
          )
        }

      </div>

    </div>

  );
}