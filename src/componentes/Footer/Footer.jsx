import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footerV2">
      <div className="footerV2__inner">
        
        {/* IZQUIERDA */}
        <div className="footerV2__left">

          {/* Marca */}
          <div className="footerV2__brand">
            <div className="footerV2__logoWrap">
              <img
                src="/imagenes/Logo-Planzo.png"
                alt="Planzo"
                className="footerV2__logo"
              />
            </div>
            <p className="footerV2__tagline">
              Eventos culturales y sociales de tu comunidad
            </p>
          </div>

          {/* 3 columnas superiores */}
          <div className="footerV2__colsTop">

            <nav className="footerV2__col">
              <h3 className="footerV2__title">Eventos</h3>
              <Link className="footerV2__link" to="/Agenda">
                • Agenda
              </Link>
              <Link className="footerV2__link" to="/Destacados">
                • Eventos destacados
              </Link>
              <Link className="footerV2__link" to="/EnviarEvento">
                • Enviar tu evento
              </Link>
            </nav>

            <nav className="footerV2__col">
              <h3 className="footerV2__title">Comunidad</h3>
              <Link className="footerV2__link" to="/QuienesSomos">
                • Quiénes somos
              </Link>
              <Link className="footerV2__link" to="/Colaboradores">
                • Colaboradores
              </Link>
              <Link className="footerV2__link" to="/Ayuntamientos">
                • Ayuntamientos
              </Link>
            </nav>

            <nav className="footerV2__col">
              <h3 className="footerV2__title">Información</h3>
              <Link className="footerV2__link" to="/Noticias">
                • Noticias
              </Link>
              <Link className="footerV2__link" to="/FAQ">
                • Preguntas frecuentes
              </Link>
              <Link className="footerV2__link" to="/Contacto">
                • Contacto
              </Link>
            </nav>

          </div>

          {/* 3 columnas inferiores */}
          <div className="footerV2__colsBottom">

            <div className="footerV2__col">
              <h3 className="footerV2__title">Contacto</h3>
              <a className="footerV2__link" href="mailto:info@planzo.es">
                info@planzo.es
              </a>
              <a className="footerV2__link" href="tel:+34910000000">
                Tel. 91 000 00 00
              </a>
              <span className="footerV2__text">
                Región Metropolitana
              </span>
            </div>

            <div className="footerV2__col">
              <h3 className="footerV2__title">Síguenos</h3>
              <a
                className="footerV2__link"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>

            <div className="footerV2__col footerV2__legal">
              <h3 className="footerV2__title">Legal</h3>
              <Link className="footerV2__link" to="/AvisoLegal">
                • Aviso legal
              </Link>
              <Link className="footerV2__link" to="/PoliticaPrivacidad">
                • Política privacidad
              </Link>
              <Link className="footerV2__link" to="/Cookies">
                • Cookies
              </Link>
              <Link className="footerV2__link" to="/Accesibilidad">
                • Accesibilidad
              </Link>
            </div>

          </div>
        </div>

        {/* CTA DERECHA */}
        <aside className="footerV2__cta">
          <p className="footerV2__ctaTitle">¿Tienes un evento?</p>

          <Link
            className="footerV2__btn footerV2__btn--primary"
            to="/PublicarEvento"
          >
            Publícalo aquí
          </Link>

          <Link
            className="footerV2__btn footerV2__btn--secondary"
            to="/Suscripcion"
          >
            Suscríbete a la Agenda Semanal
          </Link>
        </aside>

      </div>

      <div className="footerV2__bottom">
        <div className="footerV2__divider" />
        <p className="footerV2__copyright">
          2026 Planzo tu viaje en tu comunidad. Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
