import { useEffect, useRef, useState } from "react";

import api from "../api/api";
import Layout from "../components/Layout";
import RiskBadge from "../components/RiskBadge";
import ConversationSidebar from "../components/ConversationSidebar";

export default function Chat() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    selectedConversation,
    setSelectedConversation
  ] = useState(null);

  const [
    refreshConversations,
    setRefreshConversations
  ] = useState(0);

  const messagesEndRef =
    useRef(null);

  useEffect(() => {

    if (
      selectedConversation
    ) {

      loadMessages();

    }

  }, [selectedConversation]);

  useEffect(() => {

    scrollToBottom();

  }, [messages, loading]);

  function scrollToBottom() {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }

  async function loadMessages() {

    try {

      const response =
        await api.get(
          `/chat/messages/${selectedConversation}`
        );

      setMessages(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  async function askAI() {

    if (!message.trim()) {
      return;
    }

    const userId =
      localStorage.getItem(
        "healthpal_user_id"
      );

    const currentMessage =
      message;

    setMessage("");

    setLoading(true);

    try {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const response =
            await api.post(
              "/chat",
              {
                user_id:
                  userId,

                message:
                  currentMessage,

                conversation_id:
                  selectedConversation,

                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude
              }
            );

          if (
            !selectedConversation
          ) {

            setSelectedConversation(
              response.data.conversation_id
            );

            setRefreshConversations(
              prev => prev + 1
            );
          }

          await loadMessages();

          setLoading(false);
        },

        () => {

          setLoading(false);

          alert(
            "Location permission required."
          );
        }
      );

    } catch (error) {

      console.error(error);

      setLoading(false);

    }
  }

  function startNewChat() {

    setMessages([]);

    setSelectedConversation(
      null
    );

  }

  function handleKeyDown(
    e
  ) {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      askAI();

    }

  }

  return (

    <Layout>

      <div className="flex h-[85vh] bg-white rounded-xl shadow-md overflow-hidden">

        <ConversationSidebar
          selectedConversation={
            selectedConversation
          }
          setSelectedConversation={
            setSelectedConversation
          }
          refreshTrigger={
            refreshConversations
          }
        />

        <div className="flex-1 flex flex-col">

          <div className="border-b p-4 flex justify-between items-center">

            <h1 className="font-bold text-xl">
              HealthPal AI
            </h1>

            <button
              onClick={
                startNewChat
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              New Chat
            </button>

          </div>

          <div className="flex-1 overflow-y-auto p-5">

            {
              messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`mb-4 flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] rounded-xl p-4 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100"
                      }`}
                    >

                      <p className="whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {
                        msg.role === "assistant" &&
                        msg.risk_level && (

                          <div className="mt-4">

                            <RiskBadge
                              risk={
                                msg.risk_level
                              }
                            />

                            <p className="mt-2 text-sm">

                              {
                                msg.risk_reason
                              }

                            </p>

                          </div>

                        )
                      }

                      {
                        msg.role === "assistant" &&
                        msg.facilities &&
                        msg.facilities.length > 0 && (

                          <div className="mt-4">

                            <h4 className="font-semibold">
                              Nearby Facilities
                            </h4>

                            {
                              msg.facilities.map(
                                (
                                  facility,
                                  idx
                                ) => (

                                  <div
                                    key={idx}
                                    className="border rounded-lg p-3 mt-3 bg-white"
                                  >

                                    <strong>
                                      {
                                        facility.name
                                      }
                                    </strong>

                                    <p>
                                      {
                                        facility.address
                                      }
                                    </p>

                                    <a
                                      href={
                                        facility.maps_url
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 underline block mt-2"
                                    >
                                      Open In Google Maps
                                    </a>

                                  </div>

                                )
                              )
                            }

                          </div>

                        )
                      }

                      {
                        msg.created_at && (

                          <p className="text-xs mt-3 opacity-60">

                            {
                              new Date(
                                msg.created_at
                              ).toLocaleString()
                            }

                          </p>

                        )
                      }

                    </div>

                  </div>

                )
              )
            }

            {
              loading && (

                <div className="flex">

                  <div className="bg-slate-100 rounded-xl p-4">

                    <div className="animate-pulse">

                      HealthPal is analyzing symptoms...

                    </div>

                  </div>

                </div>

              )
            }

            <div
              ref={messagesEndRef}
            />

          </div>

          <div className="border-t p-4">

            <div className="flex gap-3">

              <textarea
                rows="2"
                className="flex-1 border rounded-lg p-3"
                placeholder="Describe your symptoms..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
              />

              <button
                onClick={askAI}
                className="bg-blue-600 text-white px-6 rounded-lg"
              >
                Send
              </button>

            </div>

            <p className="text-xs text-slate-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>

          </div>

        </div>

      </div>

    </Layout>

  );
}