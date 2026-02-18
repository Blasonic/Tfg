import React, { useEffect, useMemo, useState } from "react";
import "./Calendario.css";
import { toast } from "react-toastify";

import {
  listarComentariosPorFiesta,
  upsertComentario,
  getFavorito,
  addFavorito,
  removeFavorito,
} from "../../ServiciosBack/eventsService";

import { auth } from "../../firebase";

// ------------------ helpers ------------------
function formatDateRange(start, end) {
  if (!start) return "";
  const s = start.toLocaleDateString();
  const e = end ? end.toLocaleDateString() : null;
  return e && e !== s ? `${s} - ${e}` : s;
}

function formatTimeRange(start, end) {
  if (!start) return null;
  const hhmm = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

// ------------------ component ------------------
const EventoCard = ({ evento }) => {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false); // dentro del modal
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // comentar dentro modal
  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(0);

  const [fav, setFav] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [open, setOpen] = useState(false); // modal detalles

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const esCreador =
    Boolean(evento.creado_por_uid) &&
    (usuario?.uid === evento.creado_por_uid || auth.currentUser?.uid === evento.creado_por_uid);

  const fechaTxt = evento.start ? formatDateRange(evento.start, evento.end) : "";
  const horaTxt = evento.start ? formatTimeRange(evento.start, evento.end) : null;

  const tags = safeArray(evento.tags);
  const mapsUrl = buildMapsUrl(evento);

  // ----- data loading -----
  useEffect(() => {
    const run = async () => {
      try {
        const data = await listarComentariosPorFiesta(evento.id);
        setComentarios(safeArray(data));
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [evento.id]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!auth.currentUser) return;
        const data = await getFavorito(evento.id); // { saved }
        setFav(Boolean(data?.saved));
      } catch {
        // no rompas UI si no existe aún el endpoint
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
      if (fav) await removeFavorito(evento.id);
      else await addFavorito(evento.id);
      setFav(!fav);
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

  // ------------------ UI pieces ------------------
  const Desc = () => (
    <div>
      <p
        className="evento-descripcion"
        style={{
          marginTop: 10,
          marginBottom: 6,
          display: "-webkit-box",
          WebkitLineClamp: expandedDesc ? "unset" : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {evento.descripcion}
      </p>

      {evento.descripcion && evento.descripcion.length > 140 && (
        <button
          type="button"
          className="btn-link"
          onClick={() => setExpandedDesc((v) => !v)}
          style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
        >
          {expandedDesc ? "Ver menos" : "Read more"}
        </button>
      )}
    </div>
  );

  const MetaLine = ({ label, value }) =>
    value ? (
      <p style={{ margin: "6px 0" }}>
        <strong>{label}:</strong> {value}
      </p>
    ) : null;

  // ------------------ render ------------------
  return (
    <>
      {/* ===== CARD COMPACTA ===== */}
      <div className="evento-card-mini" style={styles.card}>
        <div style={styles.imgWrap}>
          <img
            src={evento.imagen || "/imagenes/default-evento.jpg"}
            alt={evento.titulo}
            style={styles.img}
          />
          <button
            onClick={toggleFav}
            disabled={loadingFav}
            title={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
            style={styles.favBtn}
          >
            {fav ? "❤️" : "🤍"}
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.headRow}>
            <h4 style={{ margin: 0, fontSize: 18 }}>{evento.titulo}</h4>
            <button className="btn-nuevo-evento" onClick={() => setOpen(true)} style={styles.detailsBtn}>
              Ver detalles
            </button>
          </div>

          <MetaLine label="Fecha" value={fechaTxt} />
          <MetaLine label="Hora" value={horaTxt} />

          {/* categoría nueva (si ya la tienes en DB) */}
          <MetaLine
            label="Categoría"
            value={
              evento.categoria
                ? `${evento.categoria}${evento.categoria_detalle ? ` · ${evento.categoria_detalle}` : ""}`
                : null
            }
          />

          <Desc />

          {tags.length > 0 && (
            <div style={styles.tagsRow}>
              {tags.slice(0, 5).map((t) => (
                <span key={t} style={styles.tag}>
                  {t}
                </span>
              ))}
              {tags.length > 5 && <span style={styles.tag}>+{tags.length - 5}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL DETALLES ===== */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.close} onClick={() => setOpen(false)}>
              ✖
            </button>

            <div style={styles.modalGrid}>
              {/* Left: imagen */}
              <div style={styles.modalLeft}>
                <img
                  src={evento.imagen || "/imagenes/default-evento.jpg"}
                  alt={evento.titulo}
                  style={styles.modalImg}
                />
              </div>

              {/* Right: info */}
              <div style={styles.modalRight}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{evento.titulo}</h2>
                    <div style={{ marginTop: 8, color: "#555" }}>
                      {fechaTxt && <div>📅 {fechaTxt}</div>}
                      {horaTxt && <div>⏰ {horaTxt}</div>}
                    </div>
                  </div>

                  <button
                    onClick={toggleFav}
                    disabled={loadingFav}
                    className="btn-nuevo-evento"
                    style={{ padding: "8px 12px", height: 40 }}
                  >
                    {fav ? "❤️ Favorito" : "🤍 Guardar"}
                  </button>
                </div>

                <div style={{ marginTop: 14 }}>
                  {evento.categoria && (
                    <div style={styles.pill}>
                      {evento.categoria}
                      {evento.categoria_detalle ? ` · ${evento.categoria_detalle}` : ""}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {tags.map((t) => (
                        <span key={t} style={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: "0 0 6px 0" }}>Descripción</h4>
                  <p style={{ margin: 0, color: "#333", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                    {evento.descripcion}
                  </p>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: "0 0 6px 0" }}>Ubicación</h4>
                  {evento.direccion || evento.municipio || evento.provincia ? (
                    <>
                      <div style={{ color: "#333" }}>
                        📍 {[evento.direccion, evento.municipio, evento.provincia || "Madrid"].filter(Boolean).join(", ")}
                      </div>

                      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-nuevo-evento"
                          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                        >
                          Ver en Google Maps
                        </a>

                        <button
                          type="button"
                          className="btn-nuevo-evento"
                          onClick={() => {
                            // mini toggle de mapa: usando estado local simple
                            const el = document.getElementById(`map-${evento.id}`);
                            if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                          }}
                        >
                          Mostrar / Ocultar mapa
                        </button>
                      </div>

                      {/* Preview mapa (sin API key, embed simple) */}
                      <div
                        id={`map-${evento.id}`}
                        style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", display: "none" }}
                      >
                        <iframe
                          title="map"
                          width="100%"
                          height="220"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            [evento.direccion, evento.municipio, evento.provincia || "Madrid"].filter(Boolean).join(", ")
                          )}&output=embed`}
                        />
                      </div>
                    </>
                  ) : (
                    <div style={{ color: "#777" }}>No hay ubicación disponible.</div>
                  )}
                </div>

                <hr style={{ margin: "18px 0" }} />

                {/* Comentarios */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <h3 style={{ margin: 0 }}>Comentarios ({comentarios.length})</h3>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        className="btn-nuevo-evento"
                        onClick={() => setMostrarComentarios((v) => !v)}
                      >
                        {mostrarComentarios ? "Ocultar" : "Ver"}
                      </button>

                      {!esCreador && auth.currentUser && (
                        <button
                          className="btn-nuevo-evento"
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
                    <div style={styles.commentBox}>
                      <h4 style={{ margin: "0 0 10px 0" }}>Tu comentario</h4>

                      <form onSubmit={enviarComentario}>
                        <div style={{ marginBottom: 10 }}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              onClick={() => setEstrellas(n)}
                              style={{
                                cursor: "pointer",
                                fontSize: "1.8rem",
                                color: n <= estrellas ? "#f4c542" : "#ccc",
                                marginRight: 4,
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <textarea
                          value={texto}
                          onChange={(e) => setTexto(e.target.value)}
                          placeholder="Escribe tu comentario..."
                          required
                          rows={4}
                          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                        />

                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          <button type="submit" className="btn-nuevo-evento">
                            Enviar
                          </button>
                          <button
                            type="button"
                            className="btn-nuevo-evento"
                            onClick={() => setMostrarFormulario(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {mostrarComentarios && (
                    <div style={{ marginTop: 14 }}>
                      {comentarios.length === 0 ? (
                        <p style={{ margin: 0, color: "#666" }}>No hay comentarios aún.</p>
                      ) : (
                        comentarios.map((c, i) => (
                          <div key={i} style={styles.commentItem}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <img
                                src={c.autor_avatar || "/imagenes/default-user.jpg"}
                                alt="avatar"
                                style={{ width: 34, height: 34, borderRadius: "50%" }}
                              />
                              <div>
                                <strong>{c.autor_nombre || "Usuario"}</strong>
                                <div style={{ color: "#f4c542" }}>
                                  {"⭐".repeat(Number(c.estrellas || 0))}
                                </div>
                              </div>
                            </div>

                            <p style={{ margin: "8px 0 0 0" }}>{c.texto}</p>

                            {c.created_at && (
                              <p style={{ fontSize: "0.8rem", color: "#888", margin: "6px 0 0 0" }}>
                                {new Date(c.created_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, color: "#777", fontSize: 12 }}>
              Consejo: usa “Guardar” para favoritos y “Ver en Google Maps” para llegar rápido.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  card: {
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 16,
    display: "grid",
    gridTemplateColumns: "170px 1fr",
  },
  imgWrap: { position: "relative", width: "100%", height: "100%" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    border: "none",
    borderRadius: 999,
    padding: "6px 10px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },
  body: { padding: 14 },
  headRow: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" },
  detailsBtn: { padding: "8px 10px", height: 40 },
  tagsRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  tag: {
    background: "#eef3ef",
    border: "1px solid #dce6de",
    color: "#2f3b33",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    zIndex: 9999,
  },
  modal: {
    width: "min(980px, 100%)",
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    position: "relative",
    padding: 16,
  },
  close: {
    position: "absolute",
    right: 14,
    top: 12,
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: 16,
  },
  modalLeft: { borderRadius: 14, overflow: "hidden", background: "#f5f5f5" },
  modalImg: { width: "100%", height: "100%", maxHeight: 460, objectFit: "cover", display: "block" },
  modalRight: { padding: 6 },
  pill: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eaf2ff",
    border: "1px solid #d6e6ff",
    fontSize: 12,
    color: "#2a3b5c",
  },
  commentBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "#fafafa",
  },
  commentItem: {
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    background: "#fff",
  },
};

export default EventoCard;
