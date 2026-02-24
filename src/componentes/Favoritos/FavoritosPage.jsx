import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import Header from "../Header/Header"; // ajusta si tu ruta cambia
import Footer from "../Footer/Footer"; // ajusta si tu ruta cambia

import EventoCard from "../Calendario/EventoCard"; // ajusta a tu path real

import { listarFiestasPublicadas, listFavoritos } from "../../ServiciosBack/eventsService";
import { auth } from "../../firebase";

export default function FavoritosPage() {
  const [loading, setLoading] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");

  const favoritosEventos = useMemo(() => {
    return eventos.filter((ev) => favoritosIds.has(Number(ev.id)));
  }, [eventos, favoritosIds]);

  const loadAll = async () => {
    try {
      setError("");
      setLoading(true);

      // 1) favoritos (users 3001)
      const favRes = await listFavoritos(); // { items: [...] }
      const ids = new Set(
        (favRes?.items || [])
          .map((x) => Number(x.fiestaId))
          .filter((n) => Number.isInteger(n) && n > 0)
      );
      setFavoritosIds(ids);

      // 2) eventos publicados (events 3000)
      const evs = await listarFiestasPublicadas();
      setEventos(Array.isArray(evs) ? evs : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error cargando favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      await loadAll();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // si no hay sesión
  if (!auth.currentUser) return <Navigate to="/Login" />;

  // callback desde EventoCard: si se desmarca (false), quitamos del listado al instante
  const handleFavoriteChange = (fiestaId, isFavorite) => {
    setFavoritosIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.add(Number(fiestaId));
      else next.delete(Number(fiestaId));
      return next;
    });
  };

  return (
    <>
      <Header />

      <div style={{ minHeight: "70vh", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Mis favoritos</h2>

          <button
            type="button"
            onClick={loadAll}
            disabled={loading}
            className="btn-nuevo-evento"
            style={{ height: 40 }}
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {loading ? (
          <p>Cargando favoritos...</p>
        ) : favoritosEventos.length === 0 ? (
          <p>No tienes favoritos guardados todavía.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {favoritosEventos.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onFavoriteChange={(isFav) => handleFavoriteChange(evento.id, isFav)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}