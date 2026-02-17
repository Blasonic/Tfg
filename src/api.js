import { auth } from "./firebase";

const API_BASE = import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:3001/api";

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado");
  return await user.getIdToken(); // luego con admin usaremos getIdToken(true) si hace falta
}

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const token = await getIdToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Error API");
  return data;
}
