import { apiFetch } from "./apiFetch";

export function bootstrapUser() {
  return apiFetch("/bootstrap", { method: "POST", authRequired: true });
}

export function getUserProfile() {
  return apiFetch("/perfil", { authRequired: true });
}

export function updateUserProfile(payload) {
  return apiFetch("/perfil", { method: "PUT", body: payload, authRequired: true });
}
