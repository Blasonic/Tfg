import React, { useState, useEffect} from "react";
import BarraLateral from '../BarraLateral/BarraLateral'
import Logo from '../Logo/Logo'
import Buscador from '../Buscador/Buscador'
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from 'react-icons/ai';
import './Header.css'


function Header() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      setUserLoggedIn(!!token);
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      setUserLoggedIn(false);
      navigate("/"); // Redirige al home después de cerrar sesión
    };
  return (
    <div className='headerStyle'>
        <BarraLateral />
        <Logo />
        <Buscador />
        {userLoggedIn ? (
        <div className="nav-item user-dropdown">
          <div className="user-icon">
            <AiOutlineUser />
          </div>
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
      ) : (
        <Link to="/Login" className="linkStyle">Log-in</Link>
      )}
    </div>
  )
}

export default Header