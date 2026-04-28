const API_URL = "http://localhost:3000/api";

export async function listarAyuntamientos() {
  const res = await fetch(`${API_URL}/ayuntamientos`);

  if (!res.ok) {
    throw new Error("Error al obtener ayuntamientos");
  }

  return res.json();
}

export async function obtenerAyuntamiento(id) {
  const res = await fetch(`${API_URL}/ayuntamientos/${id}`);

  if (!res.ok) {
    throw new Error("Error al obtener ayuntamiento");
  }

  return res.json();
}

export async function listarPlanesPorMunicipio(municipio) {
  const res = await fetch(
    `${API_URL}/ayuntamientos/municipio/${encodeURIComponent(municipio)}/planes`
  );

  if (!res.ok) {
    throw new Error("Error al obtener planes del municipio");
  }

  return res.json();
}