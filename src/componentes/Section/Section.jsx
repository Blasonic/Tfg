import React from "react";
import "./Section.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Section() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="section">
      {/* FONDO */}
      <div className="bg">
        <img src="/imagenes/fondo-section.jpg" alt={t("section.backgroundAlt")} />
      </div>

      {/* ========================= */}
      {/*      SECCIÓN SUPERIOR     */}
      {/* ========================= */}
      <div className="top-row">
        {/* IZQUIERDA: POLAROIDES */}
        <div className="top-left">
          <div className="polaroid p1">
            <img src="/imagenes/foto 7.jpg" alt={t("section.images.exp1")} />
          </div>

          <div className="polaroid p2">
            <img src="/imagenes/foto 5.webp" alt={t("section.images.exp2")} />
          </div>

          <div className="polaroid p3">
            <img src="/imagenes/foto 8.jpg" alt={t("section.images.exp3")} />
          </div>

          <div className="polaroid p4">
            <img src="/imagenes/foto 6.jpg" alt={t("section.images.exp4")} />
          </div>
        </div>

        {/* DERECHA: TEXTO */}
        <div className="top-right">
          <h2 className="title">
            {t("section.top.titleLine1")}
            <br />
            <span className="highlight">
              {t("section.top.titleHighlight")}
            </span>
          </h2>

          <h3 className="subtitle">
            {t("section.top.subtitle")}
          </h3>

          <p className="desc">
            {t("section.top.description")}
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/*      SECCIÓN INFERIOR     */}
      {/* ========================= */}
      <div className="bottom-row">
        {/* TEXTO + BOTÓN */}
        <div className="bottom-left">
          <h3 className="bottom-title">
            {t("section.bottom.title")}
          </h3>

          <p className="bottom-text">
            {t("section.bottom.text1")}
          </p>

          <p className="bottom-text">
            - {t("section.bottom.text2")}
          </p>

          <button
            className="read-btn"
            onClick={() => navigate("/EventosDestacados")}
          >
            {t("section.bottom.button")}
          </button>
        </div>

        {/* IMÁGENES */}
        <div className="bottom-right">
          <img
            src="/imagenes/foto9.jpeg"
            alt={t("section.images.plan1")}
          />

          <img
            src="/imagenes/foto3.webp"
            alt={t("section.images.plan2")}
          />

          <img
            src="/imagenes/foto 10.jpg"
            alt={t("section.images.plan3")}
          />
        </div>
      </div>
    </section>
  );
}