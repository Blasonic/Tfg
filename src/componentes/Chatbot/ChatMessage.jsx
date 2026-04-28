import React from "react";
import { useTranslation } from "react-i18next";
import ChatEventItem from "./ChatEventItem";

export default function ChatMessage({ message, onAskHowToGet }) {
  const { t } = useTranslation();

  const showHelper =
    message.role === "bot" &&
    (message.action === "ask_location" || message.action === "ask_area");

  return (
    <div className={`chatbot-msg ${message.role}`}>
      {message.text && <p>{message.text}</p>}

      {showHelper && message.action === "ask_location" && (
        <div className="chatbot-helper-card">
          <p className="chatbot-helper-title">
            {t("chatMessage.helpers.location.title")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.location.example1")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.location.example2")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.location.example3")}
          </p>
        </div>
      )}

      {showHelper && message.action === "ask_area" && (
        <div className="chatbot-helper-card">
          <p className="chatbot-helper-title">
            {t("chatMessage.helpers.area.title")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.area.example1")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.area.example2")}
          </p>
          <p className="chatbot-helper-text">
            • {t("chatMessage.helpers.area.example3")}
          </p>
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
              <p className="chatbot-route-step">
                {t("chatMessage.route.stop")} {idx + 1}
              </p>

              <ChatEventItem event={event} onAskHowToGet={onAskHowToGet} />

              {typeof event.distance_from_previous_km === "number" && (
                <p className="chatbot-route-distance">
                  {t("chatMessage.route.distanceFromPrevious")}{" "}
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
              <strong>{t("chatMessage.routeInfo.distance")}</strong>{" "}
              {message.data.routeInfo.distance_km.toFixed(2)} km
            </p>
          )}

          {typeof message.data.routeInfo.walk_minutes === "number" && (
            <p>
              <strong>{t("chatMessage.routeInfo.walking")}</strong>{" "}
              {message.data.routeInfo.walk_minutes} min
            </p>
          )}

          {typeof message.data.routeInfo.car_minutes === "number" && (
            <p>
              <strong>{t("chatMessage.routeInfo.byCar")}</strong>{" "}
              {message.data.routeInfo.car_minutes} min
            </p>
          )}

          {typeof message.data.routeInfo.transit_minutes === "number" && (
            <p>
              <strong>{t("chatMessage.routeInfo.publicTransport")}</strong>{" "}
              {message.data.routeInfo.transit_minutes} min
            </p>
          )}

          {message.data.routeInfo.recommended_mode && (
            <p>
              <strong>{t("chatMessage.routeInfo.recommended")}</strong>{" "}
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
                  {t("chatMessage.links.walking")}
                </a>
              )}

              {message.data.routeInfo.maps_links.driving && (
                <a
                  className="chatbot-maps-link"
                  href={message.data.routeInfo.maps_links.driving}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("chatMessage.links.driving")}
                </a>
              )}

              {message.data.routeInfo.maps_links.transit && (
                <a
                  className="chatbot-maps-link"
                  href={message.data.routeInfo.maps_links.transit}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("chatMessage.links.transit")}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {message.data?.location && (
        <div className="chatbot-location-card">
          <p>
            <strong>
              {message.data.location.label || t("chatMessage.location.defaultLabel")}
            </strong>
          </p>
          {message.data.location.address && <p>{message.data.location.address}</p>}
        </div>
      )}
    </div>
  );
}