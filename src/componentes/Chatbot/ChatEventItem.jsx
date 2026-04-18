import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatEventItem({ event, onAskHowToGet }) {
  const navigate = useNavigate();

  const fecha = event?.start_at
    ? new Date(event.start_at).toLocaleString()
    : event?.start
    ? new Date(event.start).toLocaleString()
    : "Fecha no disponible";

  const rating =
    typeof event?.rating === "number"
      ? event.rating
      : typeof event?.rating_avg === "number"
      ? event.rating_avg
      : null;

  return (
    <div className="chat-event-item">
      <p className="chat-event-title">{event?.titulo || "Evento sin título"}</p>

      {event?.municipio && <p className="chat-event-text">{event.municipio}</p>}

      <p className="chat-event-text">{fecha}</p>

      {event?.categoria && (
        <p className="chat-event-text">
          {event.categoria}
          {event?.categoria_detalle ? ` · ${event.categoria_detalle}` : ""}
        </p>
      )}

      {typeof rating === "number" && (
        <p className="chat-event-text">⭐ {rating.toFixed(1)}</p>
      )}

      <div className="chat-event-actions">
        <button
          className="chat-event-button"
          onClick={() => navigate(`/CalendarioGlobal?eventoId=${event.id}`)}
          type="button"
        >
          Ver evento
        </button>

        <button
          className="chat-event-button chat-event-button-secondary"
          onClick={() => onAskHowToGet?.(event.id)}
          type="button"
        >
          ¿Cómo llegar?
        </button>
      </div>
    </div>
  );
}