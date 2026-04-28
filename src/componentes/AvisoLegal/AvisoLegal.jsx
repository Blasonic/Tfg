import React from "react";
import "./AvisoLegal.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

function AvisoLegal() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />

      <section className="aviso-legal">
        <h1 className="titulo-aviso-legal">{t("legalNotice.title")}</h1>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section1.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section1.paragraph1")}
        </p>

        <p className="parrafo-aviso-legal">
          <strong>{t("legalNotice.section1.websiteOwnerLabel")}</strong> PLANZO
          <br />
          <strong>{t("legalNotice.section1.activityLabel")}</strong>{" "}
          {t("legalNotice.section1.activityValue")}
          <br />
          <strong>{t("legalNotice.section1.emailLabel")}</strong>{" "}
          [planzo.eventos@planzo.es]
          <br />
          <strong>{t("legalNotice.section1.websiteLabel")}</strong>{" "}
          [www.planzo_eventos.es]
        </p>

        <p className="parrafo-aviso-legal">
          {t("legalNotice.section1.paragraph2")}
        </p>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section2.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section2.paragraph1.before")} <strong>PLANZO</strong>{" "}
          {t("legalNotice.section2.paragraph1.after")}
        </p>

        <p className="parrafo-aviso-legal">
          {t("legalNotice.section2.paragraph2")}
        </p>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section3.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section3.paragraph1")}
        </p>

        <p className="parrafo-aviso-legal">
          {t("legalNotice.section3.prohibitedTitle")}
        </p>

        <p className="parrafo-aviso-legal">
          • {t("legalNotice.section3.prohibited1")}
          <br />
          • {t("legalNotice.section3.prohibited2")}
          <br />
          • {t("legalNotice.section3.prohibited3")}
          <br />
          • {t("legalNotice.section3.prohibited4")}
        </p>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section4.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section4.paragraph1")}
        </p>

        <p className="parrafo-aviso-legal">
          {t("legalNotice.section4.paragraph2")}
        </p>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section5.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section5.paragraph1")}
        </p>

        <p className="parrafo-aviso-legal">
          • {t("legalNotice.section5.item1")}
          <br />
          • {t("legalNotice.section5.item2")}
          <br />
          • {t("legalNotice.section5.item3")}
        </p>

        <p className="parrafo-aviso-legal">
          {t("legalNotice.section5.paragraph2")}
        </p>

        <h2 className="subtitulo-aviso-legal">
          {t("legalNotice.section6.title")}
        </h2>
        <p className="parrafo-aviso-legal">
          {t("legalNotice.section6.paragraph1")}
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default AvisoLegal;