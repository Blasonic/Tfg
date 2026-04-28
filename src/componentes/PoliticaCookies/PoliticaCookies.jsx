import React from "react";
import "./PoliticaCookies.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

function PoliticaCookies() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />

      <section className="politica-cookies">
        <h1 className="titulo-cookies">{t("cookiesPolicy.title")}</h1>

        <h2 className="subtitulo-cookies">{t("cookiesPolicy.section1.title")}</h2>
        <p className="parrafo-cookies">{t("cookiesPolicy.section1.paragraph1")}</p>

        <h2 className="subtitulo-cookies">{t("cookiesPolicy.section2.title")}</h2>
        <p className="parrafo-cookies">{t("cookiesPolicy.section2.paragraph1")}</p>

        <p className="parrafo-cookies">
          <strong>{t("cookiesPolicy.section2.technical.title")}</strong>
          <br />
          {t("cookiesPolicy.section2.technical.text")}
        </p>

        <p className="parrafo-cookies">
          <strong>{t("cookiesPolicy.section2.analytics.title")}</strong>
          <br />
          {t("cookiesPolicy.section2.analytics.text")}
        </p>

        <p className="parrafo-cookies">
          <strong>{t("cookiesPolicy.section2.customization.title")}</strong>
          <br />
          {t("cookiesPolicy.section2.customization.text")}
        </p>

        <p className="parrafo-cookies">
          <strong>{t("cookiesPolicy.section2.thirdParty.title")}</strong>
          <br />
          {t("cookiesPolicy.section2.thirdParty.text")}
        </p>

        <h2 className="subtitulo-cookies">{t("cookiesPolicy.section3.title")}</h2>
        <p className="parrafo-cookies">{t("cookiesPolicy.section3.paragraph1")}</p>

        <p className="parrafo-cookies">{t("cookiesPolicy.section3.paragraph2")}</p>

        <h2 className="subtitulo-cookies">{t("cookiesPolicy.section4.title")}</h2>
        <p className="parrafo-cookies">{t("cookiesPolicy.section4.paragraph1")}</p>

        <h2 className="subtitulo-cookies">{t("cookiesPolicy.section5.title")}</h2>
        <p className="parrafo-cookies">{t("cookiesPolicy.section5.paragraph1")}</p>
      </section>

      <Footer />
    </div>
  );
}

export default PoliticaCookies;