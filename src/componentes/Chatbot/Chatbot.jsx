import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import {
  sendChatMessage,
  updateBaseLocation,
  updateTemporaryLocation,
} from "../../ServiciosBack/chatBotService";
import ChatMessage from "./ChatMessage";

function createMessage({ role, text, data = null, action = null, type = "text" }) {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    role,
    text,
    data,
    action,
    type,
  };
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    createMessage({
      role: "bot",
      text: "Hola, ¿necesitas ayuda para encontrar planes?",
      type: "text",
    }),
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState(null);
  const [visibleEventIds, setVisibleEventIds] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const inferMessageType = (response) => {
    if (response?.data?.route) return "route";
    if (response?.data?.events) return "recommendations";
    return "text";
  };

  const extractVisibleEventIds = (response) => {
    const routeIds = response?.data?.route?.map((e) => e.id) || [];
    const eventIds = response?.data?.events?.map((e) => e.id) || [];
    const ids = [...routeIds, ...eventIds].filter(Boolean);

    return [...new Set(ids)];
  };

  const appendBotError = (text) => {
    setMessages((prev) => [
      ...prev,
      createMessage({
        role: "bot",
        text,
        type: "error",
      }),
    ]);
  };

  const handleSendMessage = async (text, extra = {}) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    const userMessage = createMessage({
      role: "user",
      text: trimmedText,
      type: "text",
    });

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: trimmedText,
        conversationState,
        visibleEventIds,
        selectedEventId: extra.selectedEventId || selectedEventId || null,
      });

      const botMessage = createMessage({
        role: "bot",
        text: res?.reply || "No he encontrado respuesta.",
        data: res?.data || null,
        action: res?.action || null,
        type: inferMessageType(res),
      });

      setMessages((prev) => [...prev, botMessage]);

      if (res?.conversationState !== undefined) {
        setConversationState(res.conversationState);
      }

      const ids = extractVisibleEventIds(res);
      if (ids.length > 0) {
        setVisibleEventIds(ids);
      }
    } catch (error) {
      console.error("Error chatbot:", error);
      appendBotError(error.message || "Error al conectar con el chatbot.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    await handleSendMessage(input);
  };

  const handleAskHowToGet = async (eventId) => {
    if (!eventId || loading) return;

    setSelectedEventId(eventId);
    await handleSendMessage("¿Cómo llego a este plan?", {
      selectedEventId: eventId,
    });
  };

  const handleSaveHome = async () => {
    const address = window.prompt("Escribe la dirección de tu casa:");
    if (!address || !address.trim()) return;

    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          text: `Guardar mi casa: ${address.trim()}`,
        }),
      ]);

      const res = await updateBaseLocation({ address: address.trim() });

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "bot",
          text:
            res?.location?.address
              ? `Perfecto. He guardado tu casa en ${res.location.address}.`
              : "He guardado tu ubicación de casa.",
          data: res?.location ? { location: res.location } : null,
          type: "text",
        }),
      ]);
    } catch (error) {
      console.error("Error guardando casa:", error);
      appendBotError("No he podido guardar tu casa. Prueba con una dirección más concreta.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemporaryLocation = async () => {
    const query = window.prompt(
      "¿Dónde estás ahora? Puedes poner hotel, calle o dirección:"
    );
    if (!query || !query.trim()) return;

    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          text: `Mi ubicación actual: ${query.trim()}`,
        }),
      ]);

      const res = await updateTemporaryLocation({
        query: query.trim(),
        label: "Ubicación actual",
      });

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "bot",
          text:
            res?.location?.address
              ? `Perfecto. Tomaré ${res.location.address} como tu ubicación actual para próximas consultas.`
              : "He guardado tu ubicación actual.",
          data: res?.location ? { location: res.location } : null,
          type: "text",
        }),
      ]);
    } catch (error) {
      console.error("Error guardando ubicación temporal:", error);
      appendBotError(
        "No he podido guardar tu ubicación actual. Prueba con una dirección o nombre más concreto."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    await handleSendMessage(question);
  };

  const handleSuggestedReply = async (text) => {
    await handleSendMessage(text);
  };

  const getSuggestionChips = () => {
    const lastBotMessage = [...messages].reverse().find((m) => m.role === "bot");

    if (!lastBotMessage?.action) return null;

    if (lastBotMessage.action === "ask_location") {
      return [
        "Estoy en Calle Gran Vía 33, Madrid",
        "Estoy en Hotel Meliá Madrid",
        "Estoy en Plaza de España, Madrid",
      ];
    }

    if (lastBotMessage.action === "ask_area") {
      return [
        "Quiero una ruta en Madrid este finde",
        "Quiero una ruta en El Escorial este finde",
        "Ruta en Alcalá de Henares esta tarde",
      ];
    }

    return null;
  };

  const suggestionChips = getSuggestionChips();

  return (
    <div className="chatbot-container">
      <div className="chatbot-tools">
        <button
          type="button"
          className="chatbot-tool-button"
          onClick={handleSaveHome}
          disabled={loading}
        >
          Guardar casa
        </button>

        <button
          type="button"
          className="chatbot-tool-button"
          onClick={handleSaveTemporaryLocation}
          disabled={loading}
        >
          Guardar ubicación actual
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onAskHowToGet={handleAskHowToGet}
          />
        ))}

        {loading && (
          <div className="chatbot-msg bot">
            <div className="chatbot-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="chatbot-quick-actions">
            <button
              type="button"
              className="chatbot-quick-button"
              onClick={() => handleQuickQuestion("¿Qué hay este finde?")}
            >
              ¿Qué hay este finde?
            </button>

            <button
              type="button"
              className="chatbot-quick-button"
              onClick={() => handleQuickQuestion("Recomiéndame planes en Madrid")}
            >
              Planes en Madrid
            </button>

            <button
              type="button"
              className="chatbot-quick-button"
              onClick={() => handleQuickQuestion("Planes de techno este mes")}
            >
              Planes techno
            </button>
          </div>
        )}

        {suggestionChips && !loading && (
          <div className="chatbot-context-suggestions">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chatbot-context-chip"
                onClick={() => handleSuggestedReply(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe algo..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />

        <button onClick={handleSend} disabled={loading} type="button">
          Enviar
        </button>
      </div>
    </div>
  );
}