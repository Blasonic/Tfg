import { apiFetch } from "./apiFetch";

export async function sendChatMessage({
  message,
  conversationState = null,
  visibleEventIds = [],
  selectedEventId = null,
  language = localStorage.getItem("i18nextLng") || "es",
}) {
  return apiFetch("/chatbot/message", {
    method: "POST",
    authRequired: true,
    body: {
      message,
      conversationState,
      visibleEventIds,
      selectedEventId,
      language,
    },
  });
}

export async function trackInteraction({ type, fiestaId }) {
  return apiFetch("/chatbot/interactions", {
    method: "POST",
    authRequired: true,
    body: {
      type,
      fiestaId,
    },
  });
}

export async function getPreferences() {
  return apiFetch("/chatbot/preferences", {
    authRequired: true,
  });
}

export async function updateBaseLocation({
  address,
  language = localStorage.getItem("i18nextLng") || "es",
}) {
  return apiFetch("/chatbot/preferences/base-location", {
    method: "PUT",
    authRequired: true,
    body: {
      address,
      language,
    },
  });
}

export async function updateTemporaryLocation({
  query,
  label = "Hotel",
  language = localStorage.getItem("i18nextLng") || "es",
}) {
  return apiFetch("/chatbot/preferences/temporary-location", {
    method: "PUT",
    authRequired: true,
    body: {
      query,
      label,
      language,
    },
  });
}

export async function resolveLocation({
  query,
  language = localStorage.getItem("i18nextLng") || "es",
}) {
  return apiFetch("/chatbot/location/resolve", {
    method: "POST",
    authRequired: true,
    body: {
      query,
      language,
    },
  });
}