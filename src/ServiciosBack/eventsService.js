import { apiFetch } from "./apiFetch";

/* =========================
   FIESTAS
========================= */

// Público (ruta real en tu backend)
export function listarFiestasPublicadas() {
  return apiFetch("/fiestas/aceptadas");
}

// Crear evento (ruta real en tu backend)
export function crearFiesta(payload) {
  return apiFetch("/fiestas/solicitar", {
    method: "POST",
    body: payload,
    authRequired: true,
  });
}

/* =========================
   COMENTARIOS
========================= */

// Público (en tu backend actual estaba como pública en rutasComentarios)
export function listarComentariosPorFiesta(fiestaId) {
  return apiFetch(`/comentarios/por-evento/${fiestaId}`);
}

// Requiere login
export function upsertComentario({ fiestaId, estrellas, texto }) {
  return apiFetch("/comentarios", {
    method: "POST",
    body: {
      fiesta_id: fiestaId,
      estrellas,
      texto,
    },
    authRequired: true,
  });
}

/* =========================
   FAVORITOS (Firestore via backend)
   - Si aún no lo tienes en backend, no romperá:
     EventoCard atrapa errores en try/catch.
========================= */

export function getFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { authRequired: true });
}

export function addFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { method: "POST", authRequired: true });
}

export function removeFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { method: "DELETE", authRequired: true });
}
