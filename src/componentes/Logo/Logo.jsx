import React from "react";
import "./Logo.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className="logoStyle">
      <Link to="/" className="linkStyle-logo">
        <img className="logo" src="/imagenes/Positivo.png" alt="Logo" />
      </Link>
    </div>
  );
}

export default Logo;
