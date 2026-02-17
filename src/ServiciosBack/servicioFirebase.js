import { apiFetch } from "./apiFetch";

export function bootstrapUser() {
  return apiFetch("/bootstrap", { method: "POST" });
}

export function getUserProfile() {
  return apiFetch("/perfil");
}

export function updateUserProfile(payload) {
  return apiFetch("/perfil", { method: "PUT", body: payload });
}
