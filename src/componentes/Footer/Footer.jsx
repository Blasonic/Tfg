import React from "react";
import { Link } from "react-router-dom";
import { AiFillInstagram } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footerV2">
      <div className="footerV2__inner">
        <div className="footerV2__left">
          <div className="footerV2__brand">
            <div className="footerV2__logoWrap">
              <Link to="/">
                <img
                  src="/imagenes/Negativo.png"
                  alt="Planzo"
                  className="footerV2__logo"
                />
              </Link>
            </div>
            <p className="footerV2__tagline">{t("footer.tagline")}</p>
          </div>

          <div className="footerV2__colsTop">
            <nav className="footerV2__col">
              <h3 className="footerV2__title">{t("footer.events.title")}</h3>
              <Link className="footerV2__link" to="/CalendarioGlobal">
                • {t("footer.events.agenda")}
              </Link>
              <Link className="footerV2__link" to="/EventosDestacados">
                • {t("footer.events.featured")}
              </Link>
              <Link className="footerV2__link" to="/FormularioAnadirFooter">
                • {t("footer.events.submit")}
              </Link>
            </nav>

            <nav className="footerV2__col">
              <h3 className="footerV2__title">{t("footer.community.title")}</h3>
              <Link className="footerV2__link" to="/SobreNosotros">
                • {t("footer.community.about")}
              </Link>
              <Link className="footerV2__link" to="/Ayuntamientos">
                • {t("footer.community.townHalls")}
              </Link>
            </nav>

            <nav className="footerV2__col">
              <h3 className="footerV2__title">{t("footer.information.title")}</h3>
              <Link className="footerV2__link" to="/Soporte">
                • {t("footer.information.support")}
              </Link>
              <Link className="footerV2__link" to="/Ayuda">
                • {t("footer.information.faq")}
              </Link>
              <Link className="footerV2__link" to="/Contacto">
                • {t("footer.information.contact")}
              </Link>
            </nav>
          </div>

          <div className="footerV2__colsBottom">
            <div className="footerV2__col">
              <h3 className="footerV2__title">{t("footer.contact.title")}</h3>

              <a
                className="footerV2__link"
                href="mailto:planzo.eventos@gmail.com"
              >
                planzo.eventos@gmail.com
              </a>

              <a
                className="footerV2__link"
                href="tel:+34910000000"
              >
                {t("footer.contact.phone")}
              </a>

              <span className="footerV2__text">
                {t("footer.contact.region")}
              </span>
            </div>

            <div className="footerV2__col">
              <h3 className="footerV2__title">{t("footer.follow.title")}</h3>

              <a
                className="footerV2__link footerV2__social"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <AiFillInstagram className="footerV2__icon" />
                {t("footer.follow.instagram")}
              </a>
            </div>

            <div className="footerV2__col footerV2__legal">
              <h3 className="footerV2__title">{t("footer.legal.title")}</h3>
              <Link className="footerV2__link" to="/AvisoLegal">
                • {t("footer.legal.legalNotice")}
              </Link>
              <Link className="footerV2__link" to="/PoliticaPrivacidad">
                • {t("footer.legal.privacyPolicy")}
              </Link>
              <Link className="footerV2__link" to="/PoliticaCookies">
                • {t("footer.legal.cookies")}
              </Link>
              <Link className="footerV2__link" to="/Accesibilidad">
                • {t("footer.legal.accessibility")}
              </Link>
            </div>
          </div>
        </div>

        <aside className="footerV2__cta">
          <p className="footerV2__ctaTitle">{t("footer.cta.title")}</p>

          <Link
            className="footerV2__btn footerV2__btn--primary"
            to="/FormularioAnadirFooter"
          >
            {t("footer.cta.publish")}
          </Link>

          <Link
            className="footerV2__btn footerV2__btn--secondary"
            to="/Suscripcion"
          >
            {t("footer.cta.subscribe")}
          </Link>
        </aside>
      </div>

      <div className="footerV2__bottom">
        <div className="footerV2__divider" />
        <p className="footerV2__copyright">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;