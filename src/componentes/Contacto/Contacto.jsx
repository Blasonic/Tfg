import React, { useState } from "react";
import "./Contacto.css";
import Header from "../Header/Header";

import Footer from "../Footer/Footer";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Contacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" }); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Nombre, email y mensaje son obligatorios." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Error al enviar el mensaje.");

      setStatus({ type: "success", text: data.message || "Mensaje enviado con éxito ✅" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus({ type: "error", text: err.message || "No se pudo enviar el mensaje." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />


      <main className="contacto-page">
        <div className="contacto-wrap">
          {/* IZQUIERDA */}
          <section className="contacto-left">
            <h1 className="contacto-title">Contact</h1>
            <p className="contacto-subtitle">Please fill out the form below to send us an email.</p>

            <p className="contacto-text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="contacto-email-block">
              <div className="contacto-email-label">E-mail:</div>
              <div className="contacto-email-value">hello@reallygreatsite.com</div>
            </div>

            {status.text ? (
              <div className={`contacto-status ${status.type}`}>{status.text}</div>
            ) : null}
          </section>

          {/* DERECHA */}
          <section className="contacto-right">
            <form className="contacto-form" onSubmit={handleSubmit}>
              <input
                className="contacto-input"
                type="text"
                placeholder="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />

              <input
                className="contacto-input"
                type="email"
                placeholder="E-MAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <input
                className="contacto-input"
                type="text"
                placeholder="SUBJECT"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />

              <textarea
                className="contacto-textarea"
                placeholder="MESSAGE"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                required
              />

              <div className="contacto-actions">
                <button className="contacto-btn" type="submit" disabled={loading}>
                  {loading ? "SENDING..." : "SUBMIT"}
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