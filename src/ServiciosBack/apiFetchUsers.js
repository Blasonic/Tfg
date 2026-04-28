import { auth } from "../firebase";

const API_USERS =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_USERS_BASE) ||
  process.env.REACT_APP_API_USERS_BASE ||
  "http://localhost:3001/api";

function getCurrentLanguage() {
  return localStorage.getItem("i18nextLng") || "es";
}

export async function apiFetchUsers(
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

  const res = await fetch(`${API_USERS}${path}`, {
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