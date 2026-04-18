import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatBot from "./Chatbot";
import "./Chatbot.css";

export default function ChatBotWidget() {
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
              <h4>Asistente de planes</h4>
              <p>Encuentra eventos, rutas y cómo llegar</p>
            </div>

            <button
              className="chatbot-header-close"
              onClick={toggleChat}
              aria-label="Cerrar chat"
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
        {!isOpen && <div className="chatbot-tooltip">¿Necesitas ayuda?</div>}

        <button
          className="chatbot-fab"
          onClick={toggleChat}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          type="button"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}