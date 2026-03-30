import React from "react";
import "./Section.css";
// Si usas react-router:
import { useNavigate } from "react-router-dom";

export default function Section() {
  const navigate = useNavigate();

  return (
    <section className="section">
      {/* FONDO */}
      <div className="bg">
        <img src="/imagenes/fondo-section.jpg" alt="fondo" />
      </div>

      {/* ========================= */}
      {/*      SECCIÓN SUPERIOR     */}
      {/* ========================= */}
      <div className="top-row">
        {/* IZQUIERDA: POLAROIDES */}
        <div className="top-left">
          <div className="polaroid p1"><img src="/imagenes/foto 7.jpg" alt="Experiencia 1" /></div>
          <div className="polaroid p2"><img src="/imagenes/foto 5.webp" alt="Experiencia 2" /></div>
          <div className="polaroid p3"><img src="/imagenes/foto 8.jpg" alt="Experiencia 3" /></div>
          <div className="polaroid p4"><img src="/imagenes/foto 6.jpg" alt="Experiencia 4" /></div>
        </div>

        {/* DERECHA: TEXTO (placeholder hasta que me pases el texto de arriba) */}
        <div className="top-right">
          <h2 className="title">
            Descubre<br />
            <span className="highlight">tu comunidad</span>
          </h2>

          <h3 className="subtitle">PLANES CON HISTORIA</h3>

          <p className="desc">
            Experiencias culturales, gastronómicas y de naturaleza para vivir tu entorno
            como nunca. Reserva en minutos y guarda tus favoritos.
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/*      SECCIÓN INFERIOR     */}
      {/* ========================= */}
      <div className="bottom-row">
        {/* TEXTO + BOTÓN */}
        <div className="bottom-left">
          <h3 className="bottom-title">EXPERIENCIAS DESTACADAS ESTE MES</h3>

          <p className="bottom-text">
            Cada mes seleccionamos planes únicos para que descubras tu entorno desde una
            mirada diferente: historia, gastronomía, naturaleza y tradiciones que merecen
            ser contadas.
          </p>

          <p className="bottom-text">
            - Consulta el calendario y reserva tu próxima experiencia
          </p>

          <button className="read-btn" onClick={() => navigate("/EventosDestacados")}>
            VER DESTACADOS DEL MES
          </button>
        </div>

        {/* IMÁGENES */}
        <div className="bottom-right">
          <img src="/imagenes/foto9.jpeg" alt="Plan 1" />
          <img src="/imagenes/foto3.webp" alt="Plan 2" />
          <img src="/imagenes/foto 10.jpg" alt="Plan 3" />
        </div>
      </div>
    </section>
  );
}