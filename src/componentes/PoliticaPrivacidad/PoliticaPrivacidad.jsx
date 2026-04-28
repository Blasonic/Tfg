import React from "react";
import "./PoliticaPrivacidad.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

function PoliticaPrivacidad() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />

      <section className="politica-privacidad">
        <h1 className="titulo-privacidad">
          {t("privacyPolicy.title")}
        </h1>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section1.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section1.paragraph1")}
        </p>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section1.paragraph2.before")}{" "}
          <strong>PLANZO</strong>
          {t("privacyPolicy.section1.paragraph2.after")}
        </p>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section2.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section2.paragraph1")}
        </p>

        <p className="parrafo-privacidad">
          • {t("privacyPolicy.section2.item1")} <br />
          • {t("privacyPolicy.section2.item2")} <br />
          • {t("privacyPolicy.section2.item3")} <br />
          • {t("privacyPolicy.section2.item4")}
        </p>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section3.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section3.paragraph1")}
        </p>

        <p className="parrafo-privacidad">
          • {t("privacyPolicy.section3.item1")} <br />
          • {t("privacyPolicy.section3.item2")} <br />
          • {t("privacyPolicy.section3.item3")}
        </p>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section4.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section4.paragraph1")}
        </p>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section5.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section5.paragraph1")}
        </p>

        <h2 className="subtitulo-privacidad">
          {t("privacyPolicy.section6.title")}
        </h2>

        <p className="parrafo-privacidad">
          {t("privacyPolicy.section6.paragraph1")}
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default PoliticaPrivacidad;