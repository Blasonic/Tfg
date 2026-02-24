// src/ServiciosBack/servicioFirebase.js
import { auth } from "../firebase";

/**
 * bootstrapUser:
 * Antes llamaba a POST /api/bootstrap (no existe en tu backend -> 404)
 * Ahora: NO hace nada (placeholder). Lo dejamos por compat.
 */
export async function bootstrapUser() {
  // Si en el futuro creas /api/bootstrap en el backend,
  // aquí vuelves a usar apiFetch("/bootstrap", { method:"POST", authRequired:true })
  return { ok: true };
}

/**
 * getUserProfile:
 * Antes llamaba a GET /api/perfil (no existe -> 404)
 * Ahora: construye un perfil mínimo a partir de Firebase Auth
 * y añade isAdmin leyendo custom claims.
 */
export async function getUserProfile() {
  const u = auth.currentUser;
  if (!u) throw new Error("No hay usuario autenticado");

  const tokenResult = await u.getIdTokenResult(true);
  const isAdmin = tokenResult?.claims?.admin === true;

  return {
    uid: u.uid,
    email: u.email,
    name: u.displayName || "",
    profilePicture: u.photoURL || "",
    isAdmin,
  };
}


export async function updateUserProfile(payload) {
  return { ok: true, payload };
}  