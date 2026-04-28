import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState([
    createMessage({
      role: "bot",
      text: t("chatbot.initialMessage"),
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

  useEffect(() => {
    setMessages((prev) => {
      if (
        prev.length === 1 &&
        prev[0].role === "bot"
      ) {
        return [
          {
            ...prev[0],
            text: t("chatbot.initialMessage"),
          },
        ];
      }
      return prev;
    });
  }, [t, i18n.language]);

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
        language: i18n.language,
      });

      const botMessage = createMessage({
        role: "bot",
        text: res?.reply || t("chatbot.fallback.noResponse"),
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
      appendBotError(error.message || t("chatbot.errors.connect"));
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
    await handleSendMessage(t("chatbot.quick.howToGet"), {
      selectedEventId: eventId,
    });
  };

  const handleSaveHome = async () => {
    const address = window.prompt(t("chatbot.prompts.homeAddress"));
    if (!address || !address.trim()) return;

    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          text: `${t("chatbot.prompts.saveHomePrefix")}: ${address.trim()}`,
        }),
      ]);

      const res = await updateBaseLocation({
        address: address.trim(),
        language: i18n.language,
      });

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "bot",
          text: res?.location?.address
            ? t("chatbot.responses.homeSavedWithAddress", {
                address: res.location.address,
              })
            : t("chatbot.responses.homeSaved"),
          data: res?.location ? { location: res.location } : null,
          type: "text",
        }),
      ]);
    } catch (error) {
      console.error("Error guardando casa:", error);
      appendBotError(t("chatbot.errors.saveHome"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemporaryLocation = async () => {
    const query = window.prompt(t("chatbot.prompts.currentLocation"));
    if (!query || !query.trim()) return;

    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          text: `${t("chatbot.prompts.currentLocationPrefix")}: ${query.trim()}`,
        }),
      ]);

      const res = await updateTemporaryLocation({
        query: query.trim(),
        label: t("chatbot.labels.currentLocation"),
        language: i18n.language,
      });

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "bot",
          text: res?.location?.address
            ? t("chatbot.responses.currentLocationSavedWithAddress", {
                address: res.location.address,
              })
            : t("chatbot.responses.currentLocationSaved"),
          data: res?.location ? { location: res.location } : null,
          type: "text",
        }),
      ]);
    } catch (error) {
      console.error("Error guardando ubicación temporal:", error);
      appendBotError(t("chatbot.errors.saveCurrentLocation"));
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
        t("chatbot.suggestions.location1"),
        t("chatbot.suggestions.location2"),
        t("chatbot.suggestions.location3"),
      ];
    }

    if (lastBotMessage.action === "ask_area") {
      return [
        t("chatbot.suggestions.area1"),
        t("chatbot.suggestions.area2"),
        t("chatbot.suggestions.area3"),
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
          {t("chatbot.buttons.saveHome")}
        </button>

        <button
          type="button"
          className="chatbot-tool-button"
          onClick={handleSaveTemporaryLocation}
          disabled={loading}
        >
          {t("chatbot.buttons.saveCurrentLocation")}
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
              onClick={() => handleQuickQuestion(t("chatbot.quick.thisWeekend"))}
            >
              {t("chatbot.quick.thisWeekend")}
            </button>

            <button
              type="button"
              className="chatbot-quick-button"
              onClick={() => handleQuickQuestion(t("chatbot.quick.plansInMadrid"))}
            >
              {t("chatbot.quick.plansInMadrid")}
            </button>

            <button
              type="button"
              className="chatbot-quick-button"
              onClick={() => handleQuickQuestion(t("chatbot.quick.technoThisMonth"))}
            >
              {t("chatbot.quick.technoThisMonth")}
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
          placeholder={t("chatbot.placeholder")}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />

        <button onClick={handleSend} disabled={loading} type="button">
          {t("chatbot.buttons.send")}
        </button>
      </div>
    </div>
  );
}