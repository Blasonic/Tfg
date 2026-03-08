import React from "react";
import "./Accesibilidad.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Accesibilidad() {
  return (
    <div>
      <Header />

      <section className="accesibilidad">
        <h1 className="titulo-accesibilidad">Accesibilidad</h1>

        <h2 className="subtitulo-accesibilidad">1. Introducción</h2>
        <p className="parrafo-accesibilidad">
          Las presentes Condiciones de Uso regulan el acceso y utilización del
          sitio web <strong>PLANZO</strong>.
        </p>
        <p className="parrafo-accesibilidad">
          El acceso al sitio web implica la aceptación plena y sin reservas de
          estas condiciones por parte del usuario.
        </p>

        <h2 className="subtitulo-accesibilidad">2. Uso del sitio web</h2>
        <p className="parrafo-accesibilidad">
          El usuario se compromete a utilizar el sitio web de forma
          responsable, respetando la legislación vigente y los derechos de
          terceros.
        </p>

        <p className="parrafo-accesibilidad">Queda prohibido:</p>

        <p className="parrafo-accesibilidad">
          • Publicar contenidos ofensivos, ilegales o que vulneren derechos de
          terceros.
          <br />
          • Utilizar el sitio web con fines fraudulentos o engañosos.
          <br />
          • Introducir virus o elementos que puedan afectar al funcionamiento
          del sitio.
        </p>

        <h2 className="subtitulo-accesibilidad">3. Contenidos del sitio web</h2>
        <p className="parrafo-accesibilidad">
          <strong>PLANZO</strong> ofrece información sobre pueblos, cultura,
          tradiciones y eventos con carácter divulgativo.
        </p>
        <p className="parrafo-accesibilidad">
          Aunque se procura mantener la información actualizada y precisa, no
          se garantiza la ausencia de errores o cambios en los eventos o
          actividades descritas.
        </p>

        <h2 className="subtitulo-accesibilidad">4. Enlaces externos</h2>
        <p className="parrafo-accesibilidad">
          El sitio web puede incluir enlaces a páginas de terceros para
          facilitar información adicional. <strong>PLANZO</strong> no se
          responsabiliza del contenido o funcionamiento de dichos sitios
          externos.
        </p>

        <h2 className="subtitulo-accesibilidad">5. Modificaciones</h2>
        <p className="parrafo-accesibilidad">
          <strong>PLANZO</strong> se reserva el derecho de modificar estas
          condiciones en cualquier momento para adaptarlas a cambios legales o
          al funcionamiento del sitio web.
        </p>

        <h2 className="subtitulo-accesibilidad">6. Legislación aplicable</h2>
        <p className="parrafo-accesibilidad">
          Estas condiciones se regirán por la legislación española vigente.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Accesibilidad;