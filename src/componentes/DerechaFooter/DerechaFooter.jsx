import React from 'react'
import './DerechaFooter.css'
import { Link } from "react-router-dom"; 

function DerechaFooter() {
  return (
    <div className="zona-derecha">
    <ul>
    <li>
      <Link to="/AvisoLegal">
        <button className="legal">Aviso Legal</button>
      </Link>
    </li>
    <li>
      <Link to="/PoliticaCookies">
        <button className="cookies">Politica de Cookies</button>
      </Link>
    </li>
    </ul>

  </div>
  )
}

export default DerechaFooter