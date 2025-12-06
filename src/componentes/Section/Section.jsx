import React from "react";
import "./Section.css";

export default function Section() {
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
          <div className="polaroid p1"><img src="/imagenes/foto1.jpg" /></div>
          <div className="polaroid p2"><img src="/imagenes/foto2.jpg" /></div>
          <div className="polaroid p3"><img src="/imagenes/foto3.webp" /></div>
          <div className="polaroid p4"><img src="/imagenes/foto4.jpg" /></div>
        </div>

        {/* DERECHA: TEXTO */}
        <div className="top-right">
          <h2 className="title">
            Travel in<br />
            <span className="highlight">your community</span>
          </h2>

          <h3 className="subtitle">KEEP A DIARY</h3>

          <p className="desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

      </div>

      {/* ========================= */}
      {/*      SECCIÓN INFERIOR     */}
      {/* ========================= */}
      <div className="bottom-row">

        {/* TEXTO + BOTÓN */}
        <div className="bottom-left">
          <p className="bottom-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>

          <button className="read-btn">READ MORE</button>
        </div>

        {/* IMÁGENES */}
        <div className="bottom-right">
          <img src="/imagenes/foto1.jpg" />
          <img src="/imagenes/foto3.webp" />
          <img src="/imagenes/foto4.jpg" />
        </div>

      </div>

    </section>
  );
}
