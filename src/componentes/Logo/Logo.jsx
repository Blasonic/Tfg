import React from "react";
import "./Logo.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className="logoStyle">
      <Link to="/" className="linkStyle">
        <h1>Logotipo</h1>
      </Link>
    </div>
  );
}
export default Logo;