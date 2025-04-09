import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './BarraLateral.css'; 

const BarraLateral = () => {
  const [abierto, setAbierto] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // 👈 también quitamos el usuario
    window.dispatchEvent(new Event("storage")); // 🔔 notificar a otros componentes
    setUserLoggedIn(false);
    navigate("/"); 
  };

  return (
    <div className="barra-lateral">
      <button 
        onClick={() => setAbierto(!abierto)}
        className="menu-btn"
      >
        <FaBars />
      </button>

      {abierto && (
        <div className="menu-container">
          <ul className="menu-list">
            <MenuLink to="/VerPerfil" texto="Ver Perfil" />
            <hr className="menu-divider" />
            <MenuLink to="/calendarioGlobal" texto="Calendario Global" />
            <MenuLink to="/fiestastra" texto="Fiestas Tradicionales" />
            <MenuLink to="/metricas" texto="Fiestas Patronales" />
            <hr className="menu-divider" />
            <MenuLink to="/comentarios" texto="Comentarios" />
            <MenuLink to="/soporte" texto="Soporte" />
            <hr className="menu-divider" />

            {userLoggedIn && (
              <button onClick={handleLogout} className="menu-button">
                Cerrar sesión
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuLink = ({ to, texto }) => {
  return (
    <li className="menu-item">
      <Link to={to} className="menu-link">
        {texto}
      </Link>
    </li>
  );
};

export default BarraLateral;
