import React, { useState } from "react";
import "./Contacto.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Contacto() {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({
        type: "error",
        text: t("contact.requiredFields"),
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": i18n.language,
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || t("contact.sendError"));
      }

      setStatus({
        type: "success",
        text: data.message || t("contact.sendSuccess"),
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || t("contact.sendFail"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <main className="contacto-page">
        <div className="contacto-wrap">
          <section className="contacto-left">
            <h1 className="contacto-title">{t("contact.title")}</h1>

            <p className="contacto-subtitle">{t("contact.subtitle")}</p>

            <p className="contacto-text">{t("contact.text1.before")} <strong>PLANZO</strong> {t("contact.text1.after")}</p>

            <p className="contacto-text">{t("contact.text2")}</p>

            <div className="contacto-topics">
              <p>- {t("contact.topics.0")}</p>
              <p>- {t("contact.topics.1")}</p>
              <p>- {t("contact.topics.2")}</p>
              <p>- {t("contact.topics.3")}</p>
            </div>

            <p className="contacto-text contacto-cta">{t("contact.cta")}</p>

            {status.text ? (
              <div className={`contacto-status ${status.type}`}>{status.text}</div>
            ) : null}
          </section>

          <section className="contacto-right">
            <form className="contacto-form" onSubmit={handleSubmit}>
              <input
                className="contacto-input"
                type="text"
                placeholder={t("contact.form.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />

              <input
                className="contacto-input"
                type="email"
                placeholder={t("contact.form.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <input
                className="contacto-input"
                type="text"
                placeholder={t("contact.form.subject")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />

              <textarea
                className="contacto-textarea"
                placeholder={t("contact.form.message")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                required
              />

              <div className="contacto-actions">
                <button className="contacto-btn" type="submit" disabled={loading}>
                  {loading ? t("contact.form.sending") : t("contact.form.send")}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contacto;