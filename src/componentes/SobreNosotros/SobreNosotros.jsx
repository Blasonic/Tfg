import React from 'react';
import './SobreNosotros.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer.jsx';

function SobreNosotros() {
  return (
    <div>
      <Header />
      <section className="sobre-nosotros">
        <h1 className="titulo-sobre-nosotros">Sobre Nosotros</h1>
        <p className="parrafo-sobre-nosotros">
          Soy un Estudiante apasianado por el Desarrollo de Aplicaciones Web
          con una misión clara: dar a conocer las fiestas y tradiciones de España de forma global.
          Creemos que cada pueblo y cada ciudad tienen historias, celebraciones y costumbres únicas
          que merecen ser compartidas con el mundo.
        </p>
        <p className="parrafo-sobre-nosotros">
          Nuestra plataforma surge de la necesidad de dar visibilidad a esas festividades que,
          aunque ricas en cultura y significado, a menudo pasan desapercibidas fuera de sus comunidades.
          Queremos ser el puente que conecte a las personas con las tradiciones más auténticas,
          permitiendo que cualquier usuario descubra eventos únicos y se sumerja en la esencia de cada región.
        </p>
        <p className="parrafo-sobre-nosotros">
          Nos esforzamos en crear un espacio accesible, dinámico e interactivo, donde los habitantes
          de los pueblos puedan compartir sus festividades y mantener viva su historia.
          Desde carnavales ancestrales hasta festivales modernos, cada celebración cuenta con un lugar
          especial en nuestra web.
        </p>
        <p className="parrafo-sobre-nosotros">
          Más allá de ser un simple catálogo de eventos, nuestra visión es construir una comunidad vibrante
          de viajeros, curiosos y apasionados por la cultura. Queremos que cada visitante de nuestra página
          encuentre inspiración para descubrir rincones especiales, vivir nuevas experiencias y conectar con
          la esencia de cada tradición.
        </p>
        <p className="parrafo-sobre-nosotros">
          Este proyecto no solo representa un desafío académico, sino una oportunidad para demostrar
          las habilidades adquiridas en el grado y contribuir a la preservación y difusión de las
          tradiciones que nos hacen únicos. Estoy emocionado por compartir este camino con ustedes
          y por seguir creciendo junto a esta increíble comunidad.
        </p>
        <p className="parrafo-sobre-nosotros">¡Gracias por formar parte de esta aventura!</p>
      </section>
      <Footer />
    </div>
  );
}

export default SobreNosotros;
