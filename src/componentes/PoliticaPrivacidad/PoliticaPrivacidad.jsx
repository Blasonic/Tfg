import React from "react";
import "./PoliticaPrivacidad.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function PoliticaPrivacidad() {
  return (
    <div>
      <Header />

      <section className="politica-privacidad">
        <h1 className="titulo-privacidad">Política de Privacidad</h1>

        <h2 className="subtitulo-privacidad">1. Información al usuario</h2>
        <p className="parrafo-privacidad">
          En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y de la Ley
          Orgánica 3/2018 de Protección de Datos Personales, informamos a los
          usuarios sobre el tratamiento de sus datos personales.
        </p>

        <p className="parrafo-privacidad">
          El responsable del tratamiento de los datos recogidos a través de
          este sitio web es <strong>PLANZO</strong>.
        </p>

        <h2 className="subtitulo-privacidad">2. Datos personales que se recopilan</h2>

        <p className="parrafo-privacidad">
          A través de esta web pueden recopilarse datos mediante:
        </p>

        <p className="parrafo-privacidad">
          • Formularios de contacto <br/>
          • Formularios de registro <br/>
          • Correos electrónicos <br/>
          • Navegación mediante cookies
        </p>

        <h2 className="subtitulo-privacidad">3. Finalidad del tratamiento</h2>

        <p className="parrafo-privacidad">
          Los datos personales se utilizan para:
        </p>

        <p className="parrafo-privacidad">
          • Gestionar consultas <br/>
          • Responder solicitudes <br/>
          • Mejorar el funcionamiento del sitio web
        </p>

        <h2 className="subtitulo-privacidad">4. Conservación de los datos</h2>

        <p className="parrafo-privacidad">
          Los datos se conservarán únicamente durante el tiempo necesario para
          cumplir la finalidad para la que fueron recogidos.
        </p>

        <h2 className="subtitulo-privacidad">5. Derechos de los usuarios</h2>

        <p className="parrafo-privacidad">
          El usuario puede ejercer los derechos de acceso, rectificación,
          supresión, oposición, limitación y portabilidad de sus datos.
        </p>

        <h2 className="subtitulo-privacidad">6. Seguridad de los datos</h2>

        <p className="parrafo-privacidad">
          El responsable adopta las medidas técnicas necesarias para proteger
          los datos personales de accesos no autorizados.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default PoliticaPrivacidad;