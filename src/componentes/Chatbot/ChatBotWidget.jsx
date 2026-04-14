import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatBot from "./Chatbot";
import "./Chatbot.css";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel">
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
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  );
};

export default ChatBotWidget;