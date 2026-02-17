import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { AiOutlineSearch } from "react-icons/ai";
import "./Header.css";

// ✅ Firebase logout
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // ajusta ruta si tu firebase.js está en otro sitio

function Header() {
  const [user, setUser] = useState(null);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const navigate = useNavigate();

  // ✅ cargar user de localStorage + escuchar cambios
  useEffect(() => {
    const load = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    load();

    // cuando haces localStorage.setItem('user') disparas storage en tu código
    window.addEventListener("storage", load);

    return () => window.removeEventListener("storage", load);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // 🔥 cierra sesión Firebase
    } catch (e) {
      // aunque falle, limpiamos local igualmente
      console.error("Logout Firebase:", e);
    }

    localStorage.removeItem("user");
    setUser(null);
    setMenuUsuario(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

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
            <Link to="/Soporte" className="nav-link">Contacto</Link>
            <Link to="/CalendarioGlobal" className="nav-link calendario">Calendario</Link>
          </nav>

          <AiOutlineSearch
            className="icono-buscar"
            onClick={() => setAbrirPopup(true)}
          />

          {user ? (
            <div className="avatar-wrapper">
              <img
                src={user.profilePicture || "/imagenes/avatares/avatar-en-blanco.webp"}
                alt="Avatar"
                className="avatar-img"
                onClick={() => setMenuUsuario(!menuUsuario)}
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
        <div className="popup-overlay" onClick={() => setAbrirPopup(false)}>
          <div className="popup-busqueda" onClick={(e) => e.stopPropagation()}>
            <button className="popup-cerrar" onClick={() => setAbrirPopup(false)}>
              ✕
            </button>

            <h2 className="popup-titulo">Buscar</h2>

            <input
              type="text"
              placeholder="Escribe para buscar..."
              className="popup-input"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
