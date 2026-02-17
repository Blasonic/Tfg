import { auth } from "../firebase";

const API =
  import.meta?.env?.VITE_API_BASE ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:3001/api";

export async function apiFetch(path, { method = "GET", body } = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado");

  const token = await user.getIdToken();

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Error API");
  return data;
}
