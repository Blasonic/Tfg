import { apiFetch } from "./apiFetch";
import { apiFetchUsers } from "./apiFetchUsers";

export function listarFiestasPublicadas() {
  return apiFetch("/fiestas/aceptadas");
}

export function crearFiesta(payload) {
  return apiFetch("/fiestas/solicitar", {
    method: "POST",
    body: payload,
    authRequired: true,
  });
}

export function listarComentariosPorFiesta(fiestaId) {
  return apiFetch(`/comentarios/por-evento/${fiestaId}`);
}

export function upsertComentario({ fiestaId, estrellas, texto }) {
  return apiFetch("/comentarios", {
    method: "POST",
    body: { fiesta_id: fiestaId, estrellas, texto },
    authRequired: true,
  });
}

export function getFavorito(fiestaId) {
  return apiFetchUsers(`/favoritos/${fiestaId}`, {
    authRequired: true,
  });
}

export function addFavorito(fiestaId) {
  return apiFetchUsers(`/favoritos/${fiestaId}`, {
    method: "POST",
    authRequired: true,
  });
}

export function removeFavorito(fiestaId) {
  return apiFetchUsers(`/favoritos/${fiestaId}`, {
    method: "DELETE",
    authRequired: true,
  });
}

export function listFavoritos() {
  return apiFetchUsers("/favoritos", {
    authRequired: true,
  });
}