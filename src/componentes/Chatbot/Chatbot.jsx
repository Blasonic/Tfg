import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import { sendChatMessage } from "../../ServiciosBack/chatbotService";
import ChatEventItem from "./ChatEventItem";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hola, ¿necesitas ayuda para encontrar planes?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage = { role: "user", text: trimmedInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: trimmedInput,
        conversationState,
        visibleEventIds: [],
      });

      const botMessage = {
        role: "bot",
        text: res?.reply || "No he encontrado respuesta.",
        data: res?.data,
        action: res?.action,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (res?.conversationState) {
        setConversationState(res.conversationState);
      }
    } catch (err) {
      console.error("Error chatbot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error al conectar con el chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-msg ${msg.role}`}>
            <p>{msg.text}</p>

            {msg.data?.events && (
              <div className="chatbot-events">
                {msg.data.events.map((e) => (
                  <ChatEventItem key={e.id} event={e} />
                ))}
              </div>
            )}

            {msg.data?.route && (
              <div className="chatbot-events">
                {msg.data.route.map((e, idx) => (
                  <div key={e.id} className="chatbot-route-item">
                    <p className="chatbot-route-step">Parada {idx + 1}</p>

                    <ChatEventItem event={e} />

                    {typeof e.distance_from_previous_km === "number" && (
                      <p className="chatbot-route-distance">
                        Distancia desde el anterior:{" "}
                        {e.distance_from_previous_km.toFixed(2)} km
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <p className="chatbot-loading">Pensando...</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe algo..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          Enviar
        </button>
      </div>
    </div>
  );
}