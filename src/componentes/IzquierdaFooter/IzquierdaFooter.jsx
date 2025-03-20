import React from 'react'
 import './IzquierdaFooter.css'
 import { Link } from "react-router-dom"; 
function IzquierdaFooter() {
  return (
    <div className="zona-izquierda">
    <ul>
    <div className="zona-izquierda">
  <ul>
    <li>
      <Link to="/SobreNosotros">
        <button className="sobrenosotros-footer">Sobre Nosotros</button>
      </Link>
    </li>
    <li>
      <Link to="/Ayuda">
        <button className="ayuda-footer">Ayuda</button>
      </Link>
    </li>
  </ul>
</div>

    </ul>
    </div>
  )
}

export default IzquierdaFooter