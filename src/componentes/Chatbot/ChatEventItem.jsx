import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatEventItem({ event }) {
  const navigate = useNavigate();

  const fecha = event?.start_at
    ? new Date(event.start_at).toLocaleString()
    : event?.start
    ? new Date(event.start).toLocaleString()
    : "Fecha no disponible";

  return (
    <div className="chat-event-item">
      <p className="chat-event-title">{event?.titulo}</p>

      {event?.municipio && (
        <p className="chat-event-text">{event.municipio}</p>
      )}

      <p className="chat-event-text">{fecha}</p>

      {event?.categoria && (
        <p className="chat-event-text">
          {event.categoria}
          {event?.categoria_detalle ? ` · ${event.categoria_detalle}` : ""}
        </p>
      )}

      <button
        className="chat-event-button"
        onClick={() => navigate(`/CalendarioGlobal?eventoId=${event.id}`)}
        type="button"
      >
        Ver evento
      </button>
    </div>
  );
}