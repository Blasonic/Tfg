import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { AiOutlineSearch } from "react-icons/ai";
import "./Header.css";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import EventoCard from "../Calendario/EventoCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function mysqlToDate(dt) {
  if (!dt) return null;
  const iso = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseTags(tagsJson) {
  if (!tagsJson) return [];
  if (Array.isArray(tagsJson)) return tagsJson;

  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizarEvento(ev) {
  const start = mysqlToDate(ev.start_at) || null;
  const end = mysqlToDate(ev.end_at) || start;

  return {
    ...ev,
    start,
    end,
    tags: parseTags(ev.tags_json),
  };
}

function Header() {
  const [user, setUser] = useState(null);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [categoria, setCategoria] = useState("");
  const [categoriaDetalle, setCategoriaDetalle] = useState("");
  const [soloFuturos, setSoloFuturos] = useState(true);

  const [filtros, setFiltros] = useState({
    categorias: [],
    categoriasDetalle: [],
    municipios: [],
  });

  const [resultados, setResultados] = useState([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (e) {
        console.warn("Header: user corrupto en localStorage, limpiando…", e);
        localStorage.removeItem("user");
        setUser(null);
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

  useEffect(() => {
    if (!abrirPopup) return;
    cargarFiltros();
  }, [abrirPopup]);

  useEffect(() => {
    if (!abrirPopup) return;

    const timer = setTimeout(() => {
      buscarEventos();
    }, 300);

    return () => clearTimeout(timer);
  }, [textoBusqueda, categoria, categoriaDetalle, soloFuturos, abrirPopup]);

  const cargarFiltros = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fiestas/filtros`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "No se pudieron cargar los filtros");
      }

      setFiltros(
        data.filtros || {
          categorias: [],
          categoriasDetalle: [],
          municipios: [],
        }
      );
    } catch (error) {
      console.error("Error cargando filtros:", error);
    }
  };

  const buscarEventos = async () => {
    try {
      const texto = textoBusqueda.trim();

      if (!texto && !categoria && !categoriaDetalle) {
        setResultados([]);
        setLoadingBusqueda(false);
        return;
      }

      setLoadingBusqueda(true);

      const params = new URLSearchParams();

      if (texto) params.append("q", texto);
      if (categoria) params.append("categoria", categoria);
      if (categoriaDetalle) params.append("categoria_detalle", categoriaDetalle);

      params.append("soloFuturos", String(soloFuturos));
      params.append("sort", "start_at_asc");
      params.append("page", "1");
      params.append("limit", "6");

      const res = await fetch(`${API_URL}/api/fiestas/buscar?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error al buscar");
      }

      const normalizados = Array.isArray(data.eventos)
        ? data.eventos.map(normalizarEvento)
        : [];

      setResultados(normalizados);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResultados([]);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda("");
    setCategoria("");
    setCategoriaDetalle("");
    setSoloFuturos(true);
    setResultados([]);
    setEventoSeleccionado(null);
  };

  const cerrarPopup = () => {
    setAbrirPopup(false);
    setEventoSeleccionado(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Firebase:", e);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setMenuUsuario(false);

    window.dispatchEvent(new Event("user-updated"));
    navigate("/");
  };

  const goFavoritos = () => {
    setMenuUsuario(false);
    navigate("/favoritos");
  };

  const avatarSrc =
    user?.avatarUrl ||
    user?.profilePicture ||
    user?.photoURL ||
    "/imagenes/avatares/avatar-en-blanco.webp";

  const resultadosPreview = useMemo(() => resultados.slice(0, 6), [resultados]);

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <Logo />
        </div>

        <div className="header-right">
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/SobreNosotros" className="nav-link">About</Link>
            <Link to="/Contacto" className="nav-link">Contacto</Link>
            <Link to="/CalendarioGlobal" className="nav-link nav-link-calendario">
              Calendario
            </Link>
          </nav>

          <AiOutlineSearch
            className="icono-buscar"
            onClick={() => setAbrirPopup(true)}
          />

          {user ? (
            <div className="avatar-wrapper">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="avatar-img"
                onClick={() => setMenuUsuario((v) => !v)}
              />

              {menuUsuario && (
                <div className="menu-usuario">
                  <Link
                    to="/VerPerfil"
                    className="menu-usuario-item"
                    onClick={() => setMenuUsuario(false)}
                  >
                    Ver Perfil
                  </Link>

                  <button
                    type="button"
                    className="menu-usuario-item"
                    onClick={goFavoritos}
                    style={{
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Favoritos
                  </button>

                  <button
                    className="menu-usuario-item cerrar-sesion"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Login" className="login-btn">Log-in</Link>
          )}
        </div>
      </header>

      {abrirPopup && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div
            className="popup-busqueda popup-busqueda-grande"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-cerrar" onClick={cerrarPopup}>
              ✕
            </button>

            <h2 className="popup-titulo">Buscar eventos</h2>
<div className="popup-filtros">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="popup-select"
              >
                <option value="">Todas las categorías</option>
                {filtros.categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={categoriaDetalle}
                onChange={(e) => setCategoriaDetalle(e.target.value)}
                className="popup-select"
              >
                <option value="">Todos los tipos</option>
                {filtros.categoriasDetalle.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              <label className="popup-check">
                <input
                  type="checkbox"
                  checked={soloFuturos}
                  onChange={(e) => setSoloFuturos(e.target.checked)}
                />
                Solo futuros
              </label>

              <button
                type="button"
                className="popup-boton-secundario"
                onClick={limpiarBusqueda}
              >
                Limpiar
              </button>
            </div>
            <div className="popup-busqueda-box">
              <input
                type="text"
                placeholder="Escribe un evento, municipio o dirección..."
                className="popup-input"
                autoFocus
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
            </div>

            

            {!eventoSeleccionado && (
              <div className="popup-resultados">
                {loadingBusqueda ? (
                  <p className="popup-info">Buscando eventos...</p>
                ) : resultadosPreview.length === 0 ? (
                  <p className="popup-info">
                    {textoBusqueda || categoria || categoriaDetalle
                      ? "No se encontraron eventos."
                      : "Empieza a escribir o elige filtros para ver resultados."}
                  </p>
                ) : (
                  resultadosPreview.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      className="resultado-item"
                      onClick={() => setEventoSeleccionado(ev)}
                    >
                      <div className="resultado-item-img">
                        <img
                          src={ev.imagen || "/imagenes/default-evento.jpg"}
                          alt={ev.titulo}
                        />
                      </div>

                      <div className="resultado-item-body">
                        <strong>{ev.titulo}</strong>
                        <span>
                          {[ev.municipio, ev.direccion].filter(Boolean).join(" · ")}
                        </span>
                        <span>
                          {ev.start ? ev.start.toLocaleDateString() : "Sin fecha"}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {eventoSeleccionado && (
              <div className="popup-detalle-evento header-eventocard-scope">
                <div className="popup-detalle-top">
                  <button
                    type="button"
                    className="popup-boton-secundario"
                    onClick={() => setEventoSeleccionado(null)}
                  >
                    ← Volver a resultados
                  </button>
                </div>

                <EventoCard key={eventoSeleccionado.id} evento={eventoSeleccionado} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;