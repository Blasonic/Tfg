import React from "react";
import "./SobreNosotros.css";
const SobreNosotros = () => {
  return (
    <section className="sobre-nosotros">
      <div className="container">
        <h1>Quienes Somos</h1>

        <p>
          En PLANZO creemos que los mejores planes no siempre están en las guías,
          ni en las grandes ciudades, ni en los algoritmos que deciden por nosotros.
        </p>

        <p>
          A menudo, están más cerca: en un pueblo, en un barrio, en una plaza donde
          alguien ha decidido mantener viva una tradición.
        </p>

        <p>
          PLANZO nace con una idea clara: dar visibilidad a esos eventos locales que
          forman parte de nuestra cultura, pero que muchas veces pasan desapercibidos.
          Fiestas populares, verbenas, ferias, romerías o celebraciones que, sin
          difusión, corren el riesgo de perderse con el tiempo.
        </p>

        <p>
          Somos una plataforma colaborativa que conecta personas, lugares y
          tradiciones. Un espacio donde cualquier usuario puede descubrir planes
          auténticos o compartir aquellos que merece la pena vivir. Cada evento
          publicado pasa por un proceso de revisión, porque creemos que la calidad y
          el respeto por la cultura local son fundamentales.
        </p>

        <p>
          Nuestro objetivo va más allá de informar: buscamos impulsar un turismo más
          consciente, descentralizado y humano, que apoye a pequeños municipios y
          ayude a mantener vivas sus costumbres.
        </p>

        <p className="highlight">
          PLANZO no es solo una agenda de planes.
        </p>

        <p>
          Es una comunidad que cree en lo auténtico, en lo cercano y en el valor de
          lo que no siempre se ve.
        </p>

        <p className="cta">
          Porque a veces, el mejor plan… todavía no lo conoces.
        </p>
      </div>
    </section>
  );
};

export default SobreNosotros;