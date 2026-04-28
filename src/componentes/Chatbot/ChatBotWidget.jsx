import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ChatBot from "./Chatbot";
import "./Chatbot.css";

export default function ChatBotWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-text">
              <h4>{t("chatbotWidget.title")}</h4>
              <p>{t("chatbotWidget.subtitle")}</p>
            </div>

            <button
              className="chatbot-header-close"
              onClick={toggleChat}
              aria-label={t("chatbotWidget.close")}
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-panel-body">
            <ChatBot />
          </div>
        </div>
      )}

      <div className="chatbot-fab-container">
        {!isOpen && (
          <div className="chatbot-tooltip">
            {t("chatbotWidget.needHelp")}
          </div>
        )}

        <button
          className="chatbot-fab"
          onClick={toggleChat}
          aria-label={isOpen ? t("chatbotWidget.close") : t("chatbotWidget.open")}
          type="button"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}