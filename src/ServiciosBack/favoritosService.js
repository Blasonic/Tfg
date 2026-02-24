// src/ServiciosBack/favoritosService.js
import { apiFetch } from "./apiFetch";

export function getFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { method: "GET", authRequired: true });
}

export function addFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { method: "POST", authRequired: true });
}

export function removeFavorito(fiestaId) {
  return apiFetch(`/favoritos/${fiestaId}`, { method: "DELETE", authRequired: true });
}

// opcional: lista todos
export function listFavoritos() {
  return apiFetch(`/favoritos`, { method: "GET", authRequired: true });
}