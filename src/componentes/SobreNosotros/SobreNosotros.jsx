import React from 'react'
import './SobreNosotros.css'
import Header from '../Header/Header'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer.jsx';
function SobreNosotros() {
  return (
    <div>
      <Header />
      <Nav />

        <section className="sobre-nosotros">
          <h1 className="titulo-sobre-nosotros">Sobre Nosotros</h1>
          <p className="parrafo-sobre-nosotros">
            Somos un grupo de estudiantes apasionados por el Desarrollo de Aplicaciones Web
             que compartimos una visión común y poderosa: crear una experiencia en línea única
              y memorable para los amantes de las zapatillas exclusivas. 
              Nuestro proyecto es la convergencia de dos grandes pasiones que nos mueven:
               el diseño web innovador y la cultura del streetwear, con un énfasis especial 
               en las sneakers de edición limitada.
          </p>
          <p className="parrafo-sobre-nosotros">
            Desde el primer momento, nos propusimos diseñar una plataforma que no solo ofreciera
             un catálogo de productos selectos, sino que también transmitiera nuestra dedicación
              por la calidad, la creatividad y la funcionalidad. Queremos que cada visitante de
               nuestra página experimente algo más que una simple compra: buscamos que se
                sumerjan en un entorno visualmente atractivo, intuitivo y emocionante,
                 que refleje la exclusividad y el estilo que caracteriza a las zapatillas
                  que seleccionamos.
          </p>
          <p className="parrafo-sobre-nosotros">
            Cada detalle de esta plataforma ha sido cuidadosamente pensado. 
            Desde la arquitectura técnica que garantiza un rendimiento rápido y eficiente,
             hasta los aspectos estéticos que capturan la esencia del streetwear, nuestro 
             objetivo es claro: marcar la diferencia en el mundo digital y convertirnos
              en una referencia para quienes comparten nuestra misma pasión por el diseño
               y las zapatillas únicas.
          </p>
          <p className="parrafo-sobre-nosotros">
            Además de ofrecer productos exclusivos, queremos ser parte de
             una comunidad vibrante y creciente, donde las personas se sientan
              conectadas por su interés en las tendencias, la moda y la innovación tecnológica.
               Creemos firmemente que la mezcla entre diseño y funcionalidad es clave para 
               brindar una experiencia en línea que esté a la altura de las expectativas de 
               nuestros usuarios.
          </p>
          <p className="parrafo-sobre-nosotros">
            Este proyecto representa para nosotros más que un simple desafío académico;
             es una oportunidad para demostrar nuestras habilidades, expresar nuestra
              creatividad y llevar al mercado una idea que nos inspira profundamente.
               Estamos emocionados por el camino que estamos recorriendo y agradecidos
                de que formes parte de este viaje. Juntos, vamos a redefinir la manera en
                 que se disfruta el streetwear y las sneakers en el entorno digital.
          </p>
          <p className="parrafo-sobre-nosotros">¡Gracias por acompañarnos en esta aventura!</p>
        </section>

      <Footer />
    </div>
  )
}

export default SobreNosotros