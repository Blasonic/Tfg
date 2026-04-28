import React from "react";
import "./SobreNosotros.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

const SobreNosotros = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />

      <main className="sobre-nosotros-page">
        <section className="sobre-nosotros">
          <div className="container">
            <h1>{t("about.title")}</h1>

            <p>{t("about.paragraph1.before")} <strong>PLANZO</strong> {t("about.paragraph1.after")}</p>

            <p>{t("about.paragraph2")}</p>

            <p>{t("about.paragraph3.before")} <strong>PLANZO</strong> {t("about.paragraph3.after")}</p>

            <p>{t("about.paragraph4")}</p>

            <p>{t("about.paragraph5")}</p>

            <p className="highlight">
              <strong>PLANZO</strong> {t("about.highlight")}
            </p>

            <p>{t("about.paragraph6")}</p>

            <p className="cta">{t("about.cta")}</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SobreNosotros;