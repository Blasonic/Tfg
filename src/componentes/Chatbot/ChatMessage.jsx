import React from "react";
import ChatEventItem from "./ChatEventItem";

export default function ChatMessage({ message, onAskHowToGet }) {
  const showHelper =
    message.role === "bot" &&
    (message.action === "ask_location" || message.action === "ask_area");

  return (
    <div className={`chatbot-msg ${message.role}`}>
      {message.text && <p>{message.text}</p>}

      {showHelper && message.action === "ask_location" && (
        <div className="chatbot-helper-card">
          <p className="chatbot-helper-title">Puedes escribir, por ejemplo:</p>
          <p className="chatbot-helper-text">• Calle Gran Vía 33, Madrid</p>
          <p className="chatbot-helper-text">• Hotel Meliá Madrid</p>
          <p className="chatbot-helper-text">• Plaza de España, Madrid</p>
        </div>
      )}

      {showHelper && message.action === "ask_area" && (
        <div className="chatbot-helper-card">
          <p className="chatbot-helper-title">Prueba con algo como:</p>
          <p className="chatbot-helper-text">• Ruta en El Escorial este finde</p>
          <p className="chatbot-helper-text">• Ruta en Madrid para esta tarde</p>
          <p className="chatbot-helper-text">• Ruta cultural en Alcalá esta semana</p>
        </div>
      )}

      {message.data?.events && (
        <div className="chatbot-events">
          {message.data.events.map((event) => (
            <ChatEventItem
              key={event.id}
              event={event}
              onAskHowToGet={onAskHowToGet}
            />
          ))}
        </div>
      )}

      {message.data?.route && (
        <div className="chatbot-events">
          {message.data.route.map((event, idx) => (
            <div key={event.id || idx} className="chatbot-route-item">
              <p className="chatbot-route-step">Parada {idx + 1}</p>

              <ChatEventItem event={event} onAskHowToGet={onAskHowToGet} />

              {typeof event.distance_from_previous_km === "number" && (
                <p className="chatbot-route-distance">
                  Distancia desde el anterior:{" "}
                  {event.distance_from_previous_km.toFixed(2)} km
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {message.data?.routeInfo && (
        <div className="chatbot-route-info">
          {typeof message.data.routeInfo.distance_km === "number" && (
            <p>
              <strong>Distancia:</strong>{" "}
              {message.data.routeInfo.distance_km.toFixed(2)} km
            </p>
          )}

          {typeof message.data.routeInfo.walk_minutes === "number" && (
            <p>
              <strong>Andando:</strong> {message.data.routeInfo.walk_minutes} min
            </p>
          )}

          {typeof message.data.routeInfo.car_minutes === "number" && (
            <p>
              <strong>En coche:</strong> {message.data.routeInfo.car_minutes} min
            </p>
          )}

          {typeof message.data.routeInfo.transit_minutes === "number" && (
            <p>
              <strong>Transporte público:</strong>{" "}
              {message.data.routeInfo.transit_minutes} min
            </p>
          )}

          {message.data.routeInfo.recommended_mode && (
            <p>
              <strong>Recomendado:</strong>{" "}
              {message.data.routeInfo.recommended_mode}
            </p>
          )}

          {message.data.routeInfo.maps_links && (
            <div className="chatbot-maps-links">
              {message.data.routeInfo.maps_links.walking && (
                <a
                  className="chatbot-maps-link"
                  href={message.data.routeInfo.maps_links.walking}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver andando
                </a>
              )}

              {message.data.routeInfo.maps_links.driving && (
                <a
                  className="chatbot-maps-link"
                  href={message.data.routeInfo.maps_links.driving}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en coche
                </a>
              )}

              {message.data.routeInfo.maps_links.transit && (
                <a
                  className="chatbot-maps-link"
                  href={message.data.routeInfo.maps_links.transit}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver transporte público
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {message.data?.location && (
        <div className="chatbot-location-card">
          <p>
            <strong>{message.data.location.label || "Ubicación"}</strong>
          </p>
          {message.data.location.address && <p>{message.data.location.address}</p>}
        </div>
      )}
    </div>
  );
}