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
  const [status, setStatus] = useState({ type: "", text: "" });

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
            <h1 className="contacto-title">Contacto</h1>

            <p className="contacto-subtitle">
              ¿Tienes un evento, una experiencia o una idea que merece ser descubierta?
            </p>

            <p className="contacto-text">
              ¿Quieres colaborar con PLANZO o simplemente tienes una duda rápida?
              Este es el lugar correcto. Escríbenos y te respondemos rápido, claro y sin rodeos.
            </p>

            <p className="contacto-text">
              Prometido: leemos todos los mensajes (y contestan personas, no bots).
              Completa el formulario y cuéntanos en qué podemos ayudarte.
              Cuanto más contexto nos des, mejor podremos orientarte.
            </p>

            <div className="contacto-topics">
              <p>- Eventos culturales</p>
              <p>- Colaboraciones con ayuntamientos o creadores</p>
              <p>- Dudas sobre experiencias, cursos o agenda</p>
              <p>- Sugerencias para mejorar PLANZO</p>
            </div>

            <p className="contacto-text contacto-cta">
              Nos gusta la gente con iniciativa.
            </p>

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
                  {loading ? "ENVIANDO..." : "ENVIAR"}
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