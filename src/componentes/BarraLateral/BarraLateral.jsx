import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './BarraLateral.css'; // Importar estilos desde CSS

const BarraLateral = () => {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="barra-lateral">
      {/* Botón para abrir/cerrar el menú */}
      <button 
        onClick={() => setAbierto(!abierto)}
        className="menu-btn"
      >
        <FaBars />
      </button>

      {/* Menú desplegable */}
      {abierto && (
        <div className="menu-container">
          <ul className="menu-list">
            <MenuLink to="/verPerfil" texto="Ver Perfil" />
            <hr className="menu-divider" />
            <MenuLink to="/calendarioGlobal" texto="Calendario Global" />
            <MenuLink to="/fiestastra" texto="Fiestas Tradicionales" />
            <MenuLink to="/metricas" texto="Fiestas Patronales" />
            <hr className="menu-divider" />
            <MenuLink to="/comentarios" texto="Comentarios" />
            <MenuLink to="/soporte" texto="Soporte" />
            <hr className="menu-divider" />
            <MenuLink to="/logout" texto="Cerrar sesión" />
          </ul>
        </div>
      )}
    </div>
  );
};

// Componente para cada enlace del menú
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
