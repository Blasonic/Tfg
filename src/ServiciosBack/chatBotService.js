import { apiFetch } from "./apiFetch";

export async function sendChatMessage({ message, conversationState, visibleEventIds }) {
  return apiFetch("/chatbot/message", {
    method: "POST",
    body: {
      message,
      conversationState,
      visibleEventIds,
    },
  });
}

export async function trackInteraction({ type, fiestaId }) {
  return apiFetch("/chatbot/interactions", {
    method: "POST",
    body: {
      type,
      fiestaId,
    },
  });
}

export async function getPreferences() {
  return apiFetch("/chatbot/preferences");
}

export async function updateBaseLocation(data) {
  return apiFetch("/chatbot/preferences/base-location", {
    method: "PUT",
    body: data,
  });
}