import React from 'react';
import './PoliticaCookies.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function PoliticaCookies() {
  return (
    <div>
      <Header />

      <section className="politica-cookies">
        <h1 className="titulo-politica-cookies">Política de Cookies</h1>
        <p className="parrafo-politica-cookies">
          <strong>Planzo</strong>, informa al usuario de que, a través del presente sitio web, únicamente se tratan datos de
          carácter personal a los efectos de responder a las consultas remitidas por los usuarios y para gestionar la publicación
          de comentarios en nuestro blog. Al respecto:
        </p>
        <p className="parrafo-politica-cookies">
          Los datos que recibamos a través del formulario de contacto serán utilizados únicamente para atender las consultas, peticiones
          o sugerencias planteadas, basándonos en su consentimiento, y serán almacenados por un período máximo de un mes, salvo que el
          usuario contrate posteriormente nuestros servicios: en tal caso, se incorporarán a nuestra base de datos de clientes, pues
          los necesitaremos para realizar los encargos encomendados, y se conservarán mientras se preste el servicio y, posteriormente,
          durante el período necesario para cubrir posibles responsabilidades (por regla general, hasta seis años).
        </p>
        <p className="parrafo-politica-cookies">
          Los datos personales que el usuario nos remita al realizar algún comentario en nuestro blog serán tratados únicamente con la
          finalidad de gestionar la publicación y de responder a las sugerencias o peticiones que, en su caso, se nos realicen. La base
          jurídica, como en el caso anterior, es el consentimiento. Los datos publicados permanecerán en el blog de forma permanente,
          y hasta que el usuario solicite su borrado.
        </p>
        <p className="parrafo-politica-cookies">
          Si el usuario nos envía sus datos personales y profesionales a través del formulario o del correo electrónico, con la intención
          de formar parte de los procesos de selección de personal de <strong>Planzo</strong>, los trataremos con esa finalidad durante un año.
        </p>
        <p className="parrafo-politica-cookies">
          En todos los casos, necesitamos ciertos datos para poder atender las solicitudes planteadas: los hemos señalado con un asterisco.
        </p>
        <p className="parrafo-politica-cookies">
          El usuario puede, en todo momento, retirar el consentimiento para el tratamiento de sus datos, así como ejercer los derechos de
          acceso, rectificación, supresión, oposición, portabilidad y limitación del tratamiento, mediante un escrito dirigido a <strong>Planzo</strong>,
          C/Hortaleza, 12 7º Izqda, 28071 Madrid, o a la dirección de correo electrónico info@planzo.com. En caso de que tengamos dudas sobre
          su identidad, le podremos solicitar copia de su DNI u otro documento identificativo válido, para evitar el acceso a sus datos por parte
          de terceros. Asimismo, puede presentar una reclamación ante la Agencia Española de Protección de Datos.
        </p>
        <h2 className="subtitulo-politica-cookies">Uso de cookies</h2>
        <p className="parrafo-politica-cookies">
          Este sitio web está libre de cookies, tanto propias como, en la medida de lo posible, de terceros. Tras realizar nuestro particular
          análisis acerca de la necesidad de utilizar este tipo de dispositivos, nuestra conclusión fue que tanto el esfuerzo técnico que nos
          suponía cumplir con la normativa como la molestia que provocaban a nuestros visitantes justificaban el tratar de eliminarlas. No obstante,
          es posible que se nos hayan quedado rezagadas algunas migas, de forma completamente involuntaria. Si es así, le rogamos que nos avise
          para que podamos retirarlas: puede usar para ello nuestro formulario de contacto.
        </p>
        <p className="parrafo-politica-cookies">Gracias por su colaboración.</p>
      </section>

      <Footer />
    </div>
  );
}

export default PoliticaCookies;
