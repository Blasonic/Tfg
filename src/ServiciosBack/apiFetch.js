import { auth } from "../firebase";

const API =
  import.meta?.env?.VITE_API_BASE ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:3000/api";

/**
 * apiFetch:
 * - Si hay usuario logueado -> añade Authorization Bearer <token>
 * - Si NO hay usuario -> hace la request sin token (para endpoints públicos)
 */
export async function apiFetch(path, { method = "GET", body, authRequired = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  } else if (authRequired) {
    // Solo falla si la llamada realmente requiere login
    throw new Error("No hay usuario autenticado");
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || "Error API");
  return data;
}
