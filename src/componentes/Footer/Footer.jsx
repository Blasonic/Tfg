import React from "react";
import "./Footer.css"; // Asegúrate de importar el CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo y frase */}
        <div className="footer-section logo-section">
          <img src="/imagenes/Logo-Planzo.png" alt="Planzo logo" className="footer-logo" />
          <p className="footer-tagline">"Planifica, localiza, organiza. <br />
          Todo en un solo lugar."</p>
        </div>

        {/* Contacto */}
        <div className="footer-section">
          <h3>Contacto</h3>
          <a href="mailto:info@planzo.com">info@planzo.com</a>
          <a href="tel:123456789">123 456 789</a>
          <a href="#">C/ Imaginaria, 42, 1ºB, <br />
            28000 Ciudad Virtual</a>
        </div>

        {/* Menú */}
        <div className="footer-section">
          <h3>Menú</h3>
          <a href="/CalendarioGlobal">Calendario</a>
          <a href="/CalendarioLocal">Fiestas Locales</a>
          <a href="/CalenadarioPatronal">Fiestas Patronales</a>
          <a href="/Ayuda">Ayuda</a>
        </div>

        {/* Avisos legales */}
        <div className="footer-section">
          <h3>Avisos Legales</h3>
          <a href="/AvisoLegal">Aviso Legal</a>
          <a href="/PoliticaCookies">Política de Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
