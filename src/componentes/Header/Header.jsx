import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import Logo from '../Logo/Logo';
import Buscador from '../Buscador/Buscador';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    setUserLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="headerStyle">
      {/* Menú + Logo en una misma línea */}
      <div className="barraLateral">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
        <div className="logo-container">
          <Logo />
        </div>

        {menuOpen && (
          <div className="menu-container">
            <ul className="menu-list">
              <li className="menu-item"><Link to="/VerPerfil" className="menu-link">Ver Perfil</Link></li>
              <hr className="menu-divider" />
              <li className="menu-item"><Link to="/CalendarioGlobal" className="menu-link">Calendario Global</Link></li>
              <li className="menu-item"><Link to="/CalendarioLocal" className="menu-link">Fiestas Locales</Link></li>
              <li className="menu-item"><Link to="/CalendarioPatronal" className="menu-link">Fiestas Patronales</Link></li>
              <hr className="menu-divider" />
              <li className="menu-item"><Link to="/comentarios" className="menu-link">Comentarios</Link></li>
              <li className="menu-item"><Link to="/Soporte" className="menu-link">Soporte</Link></li>
              <hr className="menu-divider" />
              {userLoggedIn && (
                <button onClick={handleLogout} className="menu-button">Cerrar sesión</button>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Buscador + avatar/login */}
      <div className="headerContent">
        <div className="search-container">
          <Buscador />
        </div>

        {user ? (
          <div className="nav-item user-avatar">
            <img
              src={user.profilePicture || "/imagenes/avatares/avatar-en-blanco.webp"}
              alt="Avatar"
              className="avatar-img"
            />
          </div>
        ) : (
          <Link to="/Login" className="login-btn">Log-in</Link>
        )}
      </div>
    </div>
  );
}

export default Header;
