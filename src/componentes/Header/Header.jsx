import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { AiOutlineSearch } from "react-icons/ai";
import "./Header.css";

function Header() {
  const [user, setUser] = useState(null);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuUsuario(false);
    navigate("/");
  };

  return (
    <>
      <header className="header-container">

        {/* IZQUIERDA: LOGO */}
        <div className="header-left">
          <Logo />
        </div>

        {/* DERECHA: ENLACES + LUPA + AVATAR */}
        <div className="header-right">

          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/SobreNosotros" className="nav-link">About</Link>
            <Link to="/Soporte" className="nav-link">Contacto</Link>
            <Link to="/CalendarioGlobal" className="nav-link calendario">Calendario</Link>
          </nav>

          {/* LUPA */}
          <AiOutlineSearch 
            className="icono-buscar"
            onClick={() => setAbrirPopup(true)}
          />

          {/* AVATAR + MENÚ */}
          {user ? (
            <div className="avatar-wrapper">
              <img
                src={user.profilePicture || "/imagenes/avatares/avatar-en-blanco.webp"}
                alt="Avatar"
                className="avatar-img"
                onClick={() => setMenuUsuario(!menuUsuario)}
              />

              {/* MENÚ USUARIO DESPLEGABLE */}
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

      {/* ========================== */}
      {/*       POP UP BÚSQUEDA      */}
      {/* ========================== */}
      {abrirPopup && (
        <div className="popup-overlay" onClick={() => setAbrirPopup(false)}>
          <div 
            className="popup-busqueda" 
            onClick={(e) => e.stopPropagation()}
          >
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
