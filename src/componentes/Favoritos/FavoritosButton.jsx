// src/componentes/Favoritos/FavoritosButton.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { addFavorito, getFavorito, removeFavorito } from "../../ServiciosBack/eventsService";

export default function FavoritosButton({ fiestaId }) {
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (!auth.currentUser) {
          setFav(false);
          setLoading(false);
          return;
        }
        const data = await getFavorito(fiestaId);
        setFav(Boolean(data?.isFavorite));
      } catch {
        setFav(false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [fiestaId]);

  const toggle = async () => {
    try {
      if (!auth.currentUser) {
        alert("Inicia sesión para guardar favoritos");
        return;
      }

      setLoading(true);

      if (fav) {
        const r = await removeFavorito(fiestaId);
        setFav(Boolean(r?.isFavorite));
      } else {
        const r = await addFavorito(fiestaId);
        setFav(Boolean(r?.isFavorite));
      }
    } catch (e) {
      console.error("Error toggle favorito:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        border: "none",
        background: "white",
        borderRadius: 999,
        padding: "6px 10px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}