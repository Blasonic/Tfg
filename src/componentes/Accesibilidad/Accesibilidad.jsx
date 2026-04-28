import React from "react";
import "./Accesibilidad.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

function Accesibilidad() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />

      <section className="accesibilidad">
        <h1 className="titulo-accesibilidad">
          {t("accessibility.title")}
        </h1>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section1.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section1.paragraph1.before")}{" "}
          <strong>PLANZO</strong>
          {t("accessibility.section1.paragraph1.after")}
        </p>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section1.paragraph2")}
        </p>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section2.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section2.paragraph1")}
        </p>

        <p className="parrafo-accesibilidad">
          {t("accessibility.section2.prohibitedTitle")}
        </p>

        <p className="parrafo-accesibilidad">
          • {t("accessibility.section2.prohibited1")}
          <br />
          • {t("accessibility.section2.prohibited2")}
          <br />
          • {t("accessibility.section2.prohibited3")}
        </p>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section3.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          <strong>PLANZO</strong> {t("accessibility.section3.paragraph1")}
        </p>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section3.paragraph2")}
        </p>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section4.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section4.paragraph1.before")}{" "}
          <strong>PLANZO</strong>{" "}
          {t("accessibility.section4.paragraph1.after")}
        </p>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section5.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          <strong>PLANZO</strong> {t("accessibility.section5.paragraph1")}
        </p>

        <h2 className="subtitulo-accesibilidad">
          {t("accessibility.section6.title")}
        </h2>
        <p className="parrafo-accesibilidad">
          {t("accessibility.section6.paragraph1")}
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Accesibilidad;