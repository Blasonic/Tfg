import { auth } from "../firebase";

const API =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:3000/api";

function getCurrentLanguage() {
  return localStorage.getItem("i18nextLng") || "es";
}

export async function apiFetch(
  path,
  { method = "GET", body, authRequired = false } = {}
) {
  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": getCurrentLanguage(),
  };

  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  } else if (authRequired) {
    throw new Error("No hay usuario autenticado");
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Error API");
  }

  return data;
}