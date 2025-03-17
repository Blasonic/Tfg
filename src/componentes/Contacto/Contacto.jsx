import React from 'react'
import './Contacto.css'
import Header from '../Header/Header'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { AiFillTwitterSquare } from "react-icons/ai";
import { AiFillFacebook } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";
import { AiFillPhone } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";

function Contacto() {
  return (
    <div>
        <Header/>
        <Nav/>
    <body className='Contacto'>  
    <div className="contenedor">
      <div className="informacionContacto">
        <h1>CONTÁCTE CON NOSOTROS</h1>
        <div className="datosContacto">
          <p>
            <i className="iconoTelefono"><AiFillPhone /></i> 658 765 987
          </p>
          <p>
            <i className="icono-email"><AiOutlineMail /></i> zashophelp@gmail.com
          </p>
        </div>
        <div className="links">
          <a href="#"><i className="facebook"></i><AiFillFacebook /></a>
          <a href="#"><i className="instagram"></i><AiFillInstagram /></a>
          <a  href="#"><i className="twitter"></i><AiFillTwitterSquare /></a>
          <a href="#"><i className="linkedin"></i><AiFillLinkedin /></a>
        </div>
      </div>
      <form>
        <div className="input-box">
          <input type="text" placeholder="Nombre y apellido" required />
          <i className="nombreContacto"></i>
        </div>
        <div className="input-box">
          <input type="email" placeholder="Correo electrónico" required />
          <i className="correoContacto"></i>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Asunto" />
          <i className="asuntoContacto"></i>
        </div>
        <div className="input-box">
          <textarea placeholder="Escribe tu mensaje..." />
        </div>
        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
    </body>
        <Footer/>
    </div>
  )
}

export default Contacto