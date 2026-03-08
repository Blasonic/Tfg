import React from "react";
import "./AvisoLegal.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AvisoLegal() {
  return (
    <div>
      <Header />

      <section className="aviso-legal">
        <h1 className="titulo-aviso-legal">Aviso Legal</h1>

        <h2 className="subtitulo-aviso-legal">1. Datos identificativos</h2>
        <p className="parrafo-aviso-legal">
          En cumplimiento del deber de información establecido en la Ley 34/2002
          de Servicios de la Sociedad de la Información y Comercio Electrónico
          (LSSI-CE), se informa a los usuarios de este sitio web de los
          siguientes datos:
        </p>

        <p className="parrafo-aviso-legal">
          <strong>Titular del sitio web:</strong> PLANZO
          <br />
          <strong>Actividad:</strong> Plataforma digital de información cultural,
          turística y de eventos.
          <br />
          <strong>Correo electrónico de contacto:</strong> [planzo.eventos@planzo.es]
          <br />
          <strong>Sitio web:</strong> [www.planzo_eventos.es]
        </p>

        <p className="parrafo-aviso-legal">
          El acceso y uso del sitio web atribuye la condición de usuario e
          implica la aceptación plena de las condiciones establecidas en el
          presente Aviso Legal.
        </p>

        <h2 className="subtitulo-aviso-legal">2. Objeto del sitio web</h2>
        <p className="parrafo-aviso-legal">
          El sitio web <strong>PLANZO</strong> tiene como finalidad ofrecer
          información sobre pueblos, tradiciones, fiestas, cultura y eventos,
          principalmente en la Comunidad de Madrid, con el objetivo de promover
          el conocimiento cultural y el turismo local.
        </p>

        <p className="parrafo-aviso-legal">
          Los contenidos publicados tienen carácter informativo y pueden ser
          actualizados, modificados o eliminados sin previo aviso.
        </p>

        <h2 className="subtitulo-aviso-legal">3. Condiciones de uso</h2>
        <p className="parrafo-aviso-legal">
          El usuario se compromete a hacer un uso adecuado del sitio web y de
          sus contenidos, respetando la legislación vigente, la buena fe y el
          orden público.
        </p>

        <p className="parrafo-aviso-legal">Queda prohibido:</p>

        <p className="parrafo-aviso-legal">
          • Utilizar el sitio web con fines ilícitos o contrarios a la normativa
          vigente.
          <br />
          • Provocar daños en los sistemas informáticos del sitio web o de
          terceros.
          <br />
          • Intentar acceder a áreas restringidas sin autorización.
          <br />
          • Utilizar los contenidos del sitio para fines comerciales sin
          autorización expresa.
        </p>

        <h2 className="subtitulo-aviso-legal">
          4. Propiedad intelectual e industrial
        </h2>
        <p className="parrafo-aviso-legal">
          Todos los contenidos del sitio web, incluyendo textos, imágenes,
          logotipos, diseño, estructura, código fuente y demás elementos, están
          protegidos por los derechos de propiedad intelectual e industrial.
        </p>

        <p className="parrafo-aviso-legal">
          Queda prohibida la reproducción, distribución o comunicación pública
          de los contenidos sin la autorización expresa del titular del sitio
          web.
        </p>

        <h2 className="subtitulo-aviso-legal">5. Responsabilidad</h2>
        <p className="parrafo-aviso-legal">
          El titular del sitio web no se hace responsable de:
        </p>

        <p className="parrafo-aviso-legal">
          • Posibles errores u omisiones en los contenidos.
          <br />
          • La falta de disponibilidad temporal del sitio web.
          <br />
          • Los daños derivados del uso de la información publicada.
        </p>

        <p className="parrafo-aviso-legal">
          Asimismo, el sitio web puede incluir enlaces a páginas externas sobre
          las que no tiene control ni responsabilidad.
        </p>

        <h2 className="subtitulo-aviso-legal">6. Legislación aplicable</h2>
        <p className="parrafo-aviso-legal">
          La relación entre el usuario y el titular del sitio web se regirá por
          la legislación española vigente, siendo competentes los juzgados y
          tribunales que correspondan conforme a la normativa aplicable.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default AvisoLegal;