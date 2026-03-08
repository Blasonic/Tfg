import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  listarComentariosPorFiesta,
  upsertComentario,
  getFavorito,
  addFavorito,
  removeFavorito,
} from "../../ServiciosBack/eventsService";
import { auth } from "../../firebase";

function formatDateRange(start, end) {
  if (!start) return "";
  const s = new Date(start).toLocaleDateString("es-ES");
  const e = end ? new Date(end).toLocaleDateString("es-ES") : null;
  return e && e !== s ? `${s} - ${e}` : s;
}

function formatTimeRange(start, end) {
  if (!start) return null;
  const hhmm = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const s = hhmm(start);
  const e = end ? hhmm(end) : null;
  return e && e !== s ? `${s} - ${e}` : s;
}

function buildMapsUrl(evento) {
  const parts = [];
  if (evento.direccion) parts.push(evento.direccion);
  if (evento.municipio) parts.push(evento.municipio);
  if (evento.provincia) parts.push(evento.provincia);
  else parts.push("Madrid");

  const q = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

const EventoDestacadoCard = ({ evento, onFavoriteChange }) => {
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const [comentarios, setComentarios] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(0);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        setUsuario(raw ? JSON.parse(raw) : null);
      } catch {
        setUsuario(null);
      }
    };

    load();
    window.addEventListener("user-updated", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("user-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const esCreador =
    Boolean(evento.creado_por_uid) &&
    (usuario?.uid === evento.creado_por_uid ||
      auth.currentUser?.uid === evento.creado_por_uid);

  const fechaTxt = evento.start ? formatDateRange(evento.start, evento.end) : "";
  const horaTxt = evento.start ? formatTimeRange(evento.start, evento.end) : null;
  const tags = safeArray(evento.tags);
  const mapsUrl = buildMapsUrl(evento);
  const rating = Number(evento.rating || 0);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listarComentariosPorFiesta(evento.id);
        setComentarios(safeArray(data));
      } catch (e) {
        console.error(e);
      }
    };

    if (open) run();
  }, [evento.id, open]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!auth.currentUser) return;
        const data = await getFavorito(evento.id);
        setFav(Boolean(data?.isFavorite));
      } catch {
        // no romper UI
      }
    };

    run();
  }, [evento.id]);

  const toggleFav = async () => {
    if (!auth.currentUser) {
      toast.error("Inicia sesión para guardar favoritos");
      return;
    }

    setLoadingFav(true);

    try {
      if (fav) {
        const r = await removeFavorito(evento.id);
        const next = Boolean(r?.isFavorite);
        setFav(next);
        onFavoriteChange?.(next);
      } else {
        const r = await addFavorito(evento.id);
        const next = Boolean(r?.isFavorite);
        setFav(next);
        onFavoriteChange?.(next);
      }
    } catch (e) {
      toast.error(e.message || "No se pudo actualizar favorito");
    } finally {
      setLoadingFav(false);
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("Inicia sesión para comentar");
      return;
    }

    if (!estrellas || estrellas < 1 || estrellas > 5) {
      toast.error("Selecciona 1-5 estrellas");
      return;
    }

    try {
      await upsertComentario({ fiestaId: evento.id, estrellas, texto });
      toast.success("Comentario guardado");

      const data = await listarComentariosPorFiesta(evento.id);
      setComentarios(safeArray(data));
      setTexto("");
      setEstrellas(0);
      setMostrarFormulario(false);
      setMostrarComentarios(true);
    } catch (e2) {
      toast.error(e2.message || "Error al comentar");
    }
  };

  return (
    <>
      <article className="evento-destacado-card">
        <div className="evento-destacado-card__image-wrapper">
          <img
            src={evento.imagen || "/imagenes/default-evento.jpg"}
            alt={evento.titulo}
            className="evento-destacado-card__image"
          />

          <button
            onClick={toggleFav}
            disabled={loadingFav}
            className="evento-destacado-card__fav"
            title={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            {fav ? "❤️" : "🤍"}
          </button>

          <div className="evento-destacado-card__rating">
            <span>★</span> {rating.toFixed(1)}
          </div>
        </div>

        <div className="evento-destacado-card__content">
          <h3 className="evento-destacado-card__title">{evento.titulo}</h3>

          {fechaTxt && (
            <p className="evento-destacado-card__date">
              {fechaTxt}
            </p>
          )}

          <button
            className="evento-destacado-card__button"
            onClick={() => setOpen(true)}
          >
            VER DETALLES
          </button>
        </div>
      </article>

      {open && (
        <div
          className="evento-modal-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="evento-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="evento-modal-close"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>

            <div className="evento-modal-grid">
              <div className="evento-modal-left">
                <img
                  src={evento.imagen || "/imagenes/default-evento.jpg"}
                  alt={evento.titulo}
                  className="evento-modal-img"
                />
              </div>

              <div className="evento-modal-right">
                <div className="evento-modal-top">
                  <div>
                    <h2 className="evento-modal-title">{evento.titulo}</h2>

                    <div className="evento-modal-meta">
                      {fechaTxt && <div>📅 {fechaTxt}</div>}
                      {horaTxt && <div>⏰ {horaTxt}</div>}
                    </div>
                  </div>

                  <button
                    onClick={toggleFav}
                    disabled={loadingFav}
                    className="evento-modal-fav-btn"
                  >
                    {fav ? "❤️ Favorito" : "🤍 Guardar"}
                  </button>
                </div>

                <div className="evento-modal-section">
                  {evento.categoria && (
                    <div className="evento-modal-pill">
                      {evento.categoria}
                      {evento.categoria_detalle
                        ? ` · ${evento.categoria_detalle}`
                        : ""}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div className="evento-modal-tags">
                      {tags.map((t) => (
                        <span key={t} className="evento-modal-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="evento-modal-section">
                  <h4>Descripción</h4>
                  <p className="evento-modal-text">
                    {evento.descripcion || "Sin descripción disponible."}
                  </p>
                </div>

                <div className="evento-modal-section">
                  <h4>Ubicación</h4>

                  {evento.direccion || evento.municipio || evento.provincia ? (
                    <>
                      <div className="evento-modal-location">
                        📍{" "}
                        {[evento.direccion, evento.municipio, evento.provincia || "Madrid"]
                          .filter(Boolean)
                          .join(", ")}
                      </div>

                      <div className="evento-modal-actions">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="evento-modal-main-btn"
                        >
                          Ver en Google Maps
                        </a>

                        <button
                          type="button"
                          className="evento-modal-main-btn"
                          onClick={() => {
                            const el = document.getElementById(`map-${evento.id}`);
                            if (el) {
                              el.style.display =
                                el.style.display === "none" ? "block" : "none";
                            }
                          }}
                        >
                          Mostrar / Ocultar mapa
                        </button>
                      </div>

                      <div
                        id={`map-${evento.id}`}
                        className="evento-modal-map"
                        style={{ display: "none" }}
                      >
                        <iframe
                          title="map"
                          width="100%"
                          height="220"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            [evento.direccion, evento.municipio, evento.provincia || "Madrid"]
                              .filter(Boolean)
                              .join(", ")
                          )}&output=embed`}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="evento-modal-muted">
                      No hay ubicación disponible.
                    </div>
                  )}
                </div>

                <hr className="evento-modal-divider" />

                <div className="evento-modal-section">
                  <div className="evento-modal-comments-head">
                    <h3>Comentarios ({comentarios.length})</h3>

                    <div className="evento-modal-actions">
                      <button
                        className="evento-modal-main-btn"
                        onClick={() =>
                          setMostrarComentarios((v) => !v)
                        }
                      >
                        {mostrarComentarios ? "Ocultar" : "Ver"}
                      </button>

                      {!esCreador && auth.currentUser && (
                        <button
                          className="evento-modal-main-btn"
                          onClick={() => {
                            setMostrarFormulario(true);
                            setMostrarComentarios(true);
                          }}
                        >
                          Comentar
                        </button>
                      )}
                    </div>
                  </div>

                  {mostrarFormulario && (
                    <div className="evento-modal-comment-box">
                      <h4>Tu comentario</h4>

                      <form onSubmit={enviarComentario}>
                        <div className="evento-modal-stars">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              onClick={() => setEstrellas(n)}
                              className="evento-modal-star"
                              style={{
                                color: n <= estrellas ? "#f4c542" : "#ccc",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <textarea
                          value={texto}
                          onChange={(e) => setTexto(e.target.value)}
                          placeholder="Escribe tu comentario."
                          required
                          rows={4}
                          className="evento-modal-textarea"
                        />

                        <div className="evento-modal-actions">
                          <button type="submit" className="evento-modal-main-btn">
                            Enviar
                          </button>
                          <button
                            type="button"
                            className="evento-modal-main-btn"
                            onClick={() => setMostrarFormulario(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {mostrarComentarios && (
                    <div className="evento-modal-comments-list">
                      {comentarios.length === 0 ? (
                        <p className="evento-modal-muted">
                          No hay comentarios aún.
                        </p>
                      ) : (
                        comentarios.map((c, i) => (
                          <div key={i} className="evento-modal-comment-item">
                            <div className="evento-modal-comment-user">
                              <img
                                src={c.autor_avatar || "/imagenes/default-user.jpg"}
                                alt="avatar"
                                className="evento-modal-avatar"
                              />
                              <div>
                                <strong>{c.autor_nombre || "Usuario"}</strong>
                                <div className="evento-modal-stars-text">
                                  {"⭐".repeat(Number(c.estrellas || 0))}
                                </div>
                              </div>
                            </div>

                            <p className="evento-modal-text">{c.texto}</p>

                            {c.created_at && (
                              <p className="evento-modal-date-small">
                                {new Date(c.created_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="evento-modal-tip">
                  Consejo: usa “Guardar” para favoritos y “Ver en Google Maps”
                  para llegar rápido.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventoDestacadoCard;