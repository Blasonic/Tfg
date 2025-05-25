import React from "react";
import "./Section.css";

export default function Section() {
  return (
    <section className="section-container">
      {/* Decoración fondo avión */}
      <img src="/imagenes/avion.webp" alt="Avión decorativo" className="decor decor-avion" />
      <img src="/imagenes/mapa.webp" alt="Mapa decorativo" className="decor decor-map" />
      <img src="/imagenes/camara.png" alt="Cámara decorativa" className="decor decor-camara" />

      <div className="section-content">
        {/* Imágenes Polaroid posicionadas con niveles */}
        <div className="polaroid-layout">
          <div className="polaroid polaroid-1">
            <img src="/imagenes/foto1.jpg" alt="Imagen 1" />
          </div>
          <div className="polaroid polaroid-2">
            <img src="/imagenes/foto2.jpg" alt="Imagen 2" />
          </div>
          <div className="polaroid polaroid-3">
            <img src="/imagenes/foto3.webp" alt="Imagen 3" />
          </div>
          <div className="polaroid polaroid-4">
            <img src="/imagenes/foto4.jpg" alt="Imagen 4" />
          </div>
        </div>

        {/* Texto */}
        <div className="text-block">
          <h2 className="title">
            Viaja por <span className="highlight">tu comunidad</span>
          </h2>
          <h3 className="subtitle">LLEVA UN DIARIO</h3>
          <p className="paragraph">
          Descubre rincones únicos, planea nuevas aventuras y redescubre lo que te rodea.
          Cada salida es una oportunidad para sorprenderte, conocer personas increíbles y crear recuerdos. 
          ¡Empieza hoy tu viaje cerca de casa!
          </p>
        </div>
      </div>
    </section>
  );
}
