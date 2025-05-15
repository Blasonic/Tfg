import React, { useState, useEffect } from "react";
import BarraLateral from '../BarraLateral/BarraLateral';
import Logo from '../Logo/Logo';
import Buscador from '../Buscador/Buscador';
import { Link } from "react-router-dom";
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    // 🔁 Escuchar cambios en el localStorage
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <div className="headerStyle">
      <div className="barraLateral">
        <BarraLateral />
      </div>

      <div className="headerContent">
  <div className="logo-container">
    <Logo />
  </div>

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
