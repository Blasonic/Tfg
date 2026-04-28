import { auth } from "../firebase";

const API_BASE = "http://localhost:3001/api";

function getCurrentLanguage() {
  return localStorage.getItem("i18nextLng") || "es";
}

async function apiFetch(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado");

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": getCurrentLanguage(),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

export function bootstrapUser() {
  return apiFetch("/bootstrap", {
    method: "POST",
  });
}

export function getUserProfile() {
  return apiFetch("/perfil");
}

export function updateUserProfile(payload) {
  return apiFetch("/perfil", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}