import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../Logo/Logo";
import { AiOutlineSearch } from "react-icons/ai";
import "./Header.css";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import EventoCard from "../Calendario/EventoCard";

const banderaES = "/imagenes/spain.jpeg";
const banderaEN = "/imagenes/unitedKingdom.jpeg";

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
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [menuIdioma, setMenuIdioma] = useState(false);
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

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

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

  useEffect(() => {
    const cerrarMenus = () => {
      setMenuUsuario(false);
      setMenuIdioma(false);
    };

    window.addEventListener("click", cerrarMenus);
    return () => window.removeEventListener("click", cerrarMenus);
  }, []);

  const cargarFiltros = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fiestas/filtros`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || t("header.errors.loadFilters"));
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
        throw new Error(data.message || t("header.errors.search"));
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
            <Link to="/" className="nav-link">
              {t("header.nav.home")}
            </Link>
            <Link to="/SobreNosotros" className="nav-link">
              {t("header.nav.about")}
            </Link>
            <Link to="/Contacto" className="nav-link">
              {t("header.nav.contact")}
            </Link>
            <Link to="/CalendarioGlobal" className="nav-link nav-link-calendario">
              {t("header.nav.calendar")}
            </Link>
          </nav>

          <AiOutlineSearch
            className="icono-buscar"
            onClick={(e) => {
              e.stopPropagation();
              setAbrirPopup(true);
              setMenuUsuario(false);
              setMenuIdioma(false);
            }}
            title={t("header.search.openSearch")}
          />

          {user ? (
            <div className="avatar-wrapper" onClick={(e) => e.stopPropagation()}>
              <img
                src={avatarSrc}
                alt={t("header.user.avatarAlt")}
                className="avatar-img"
                onClick={() => {
                  setMenuUsuario((v) => !v);
                  setMenuIdioma(false);
                }}
              />

              {menuUsuario && (
                <div className="menu-usuario">
                  <Link
                    to="/VerPerfil"
                    className="menu-usuario-item"
                    onClick={() => setMenuUsuario(false)}
                  >
                    {t("header.user.viewProfile")}
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
                    {t("header.user.favorites")}
                  </button>

                  <button
                    className="menu-usuario-item cerrar-sesion"
                    onClick={handleLogout}
                  >
                    {t("header.user.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Login" className="login-btn">
              {t("header.user.login")}
            </Link>
          )}

          <div
            className="language-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="language-current"
              onClick={() => {
                setMenuIdioma((prev) => !prev);
                setMenuUsuario(false);
              }}
            >
              <img
                src={i18n.language?.startsWith("en") ? banderaEN : banderaES}
                alt={
                  i18n.language?.startsWith("en")
                    ? t("header.language.english")
                    : t("header.language.spanish")
                }
                className="flag-icon-large"
              />
            </button>

            {menuIdioma && (
              <div className="language-menu">
                {!i18n.language?.startsWith("es") && (
                  <button
                    type="button"
                    className="language-option"
                    onClick={() => {
                      cambiarIdioma("es");
                      setMenuIdioma(false);
                    }}
                  >
                    <img
                      src={banderaES}
                      alt={t("header.language.spanish")}
                      className="flag-icon-large"
                    />
                    <span>{t("header.language.spanish")}</span>
                  </button>
                )}

                {!i18n.language?.startsWith("en") && (
                  <button
                    type="button"
                    className="language-option"
                    onClick={() => {
                      cambiarIdioma("en");
                      setMenuIdioma(false);
                    }}
                  >
                    <img
                      src={banderaEN}
                      alt={t("header.language.english")}
                      className="flag-icon-large"
                    />
                    <span>{t("header.language.english")}</span>
                  </button>
                )}
              </div>
            )}
          </div>
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

            <h2 className="popup-titulo">{t("header.search.title")}</h2>

            <div className="popup-filtros">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="popup-select"
              >
                <option value="">{t("header.search.allCategories")}</option>
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
                <option value="">{t("header.search.allTypes")}</option>
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
                {t("header.search.onlyUpcoming")}
              </label>

              <button
                type="button"
                className="popup-boton-secundario"
                onClick={limpiarBusqueda}
              >
                {t("header.search.clear")}
              </button>
            </div>

            <div className="popup-busqueda-box">
              <input
                type="text"
                placeholder={t("header.search.placeholder")}
                className="popup-input"
                autoFocus
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
            </div>

            {!eventoSeleccionado && (
              <div className="popup-resultados">
                {loadingBusqueda ? (
                  <p className="popup-info">{t("header.search.loading")}</p>
                ) : resultadosPreview.length === 0 ? (
                  <p className="popup-info">
                    {textoBusqueda || categoria || categoriaDetalle
                      ? t("header.search.noResults")
                      : t("header.search.initialMessage")}
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
                          {ev.start
                            ? ev.start.toLocaleDateString(
                                i18n.language?.startsWith("en") ? "en-GB" : "es-ES"
                              )
                            : t("header.search.noDate")}
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
                    {t("header.search.backToResults")}
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