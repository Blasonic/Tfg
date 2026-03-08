import React from "react";
import "./PoliticaCookies.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function PoliticaCookies() {
  return (
    <div>
      <Header />

      <section className="politica-cookies">
        <h1 className="titulo-cookies">Política de Cookies</h1>

        <h2 className="subtitulo-cookies">1. Qué son las cookies</h2>
        <p className="parrafo-cookies">
          Las cookies son pequeños archivos de texto que se almacenan en el
          dispositivo del usuario cuando visita un sitio web. Su finalidad es
          mejorar la experiencia de navegación, analizar el uso del sitio y
          ofrecer contenidos adaptados a los intereses del usuario.
        </p>

        <h2 className="subtitulo-cookies">2. Tipos de cookies utilizadas</h2>
        <p className="parrafo-cookies">
          Este sitio web puede utilizar los siguientes tipos de cookies:
        </p>

        <p className="parrafo-cookies">
          <strong>Cookies técnicas</strong>
          <br />
          Permiten el funcionamiento básico del sitio web y el acceso a
          determinadas funciones.
        </p>

        <p className="parrafo-cookies">
          <strong>Cookies de análisis</strong>
          <br />
          Permiten analizar el comportamiento de los usuarios en el sitio web
          para mejorar la experiencia de navegación y optimizar los contenidos.
        </p>

        <p className="parrafo-cookies">
          <strong>Cookies de personalización</strong>
          <br />
          Permiten recordar preferencias del usuario, como idioma o
          configuración de navegación.
        </p>

        <p className="parrafo-cookies">
          <strong>Cookies de terceros</strong>
          <br />
          En algunos casos pueden utilizarse servicios de terceros para
          analizar el uso del sitio web o mejorar determinados servicios.
        </p>

        <h2 className="subtitulo-cookies">3. Gestión de cookies</h2>
        <p className="parrafo-cookies">
          El usuario puede permitir, bloquear o eliminar las cookies instaladas
          en su dispositivo mediante la configuración del navegador que utilice.
        </p>

        <p className="parrafo-cookies">
          Cada navegador dispone de opciones específicas para gestionar las
          cookies.
        </p>

        <h2 className="subtitulo-cookies">
          4. Aceptación de la política de cookies
        </h2>
        <p className="parrafo-cookies">
          Al acceder al sitio web, el usuario verá un aviso informativo sobre
          el uso de cookies. Al continuar navegando, se considera que acepta su
          uso en las condiciones descritas en esta política.
        </p>

        <h2 className="subtitulo-cookies">
          5. Actualización de la política de cookies
        </h2>
        <p className="parrafo-cookies">
          El responsable del sitio web puede modificar esta política de cookies
          en función de cambios legislativos o técnicos. Se recomienda revisar
          esta sección periódicamente.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default PoliticaCookies;