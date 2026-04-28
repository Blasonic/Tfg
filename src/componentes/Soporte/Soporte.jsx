import { useEffect, useState } from "react";
import "./Soporte.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

function Soporte() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensajes, setMensajes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setEmail(u?.email || "");
      setAuthReady(true);

      if (!u) {
        toast.warning(t("support.toasts.loginRequiredAccess"));
        setTimeout(() => navigate("/Login"), 1200);
      }
    });

    return () => unsub();
  }, [navigate, t]);

  const obtenerMensajes = async () => {
    try {
      const res = await fetch(`${API_BASE}/soporte/lista`);
      if (!res.ok) return;
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error(t("support.toasts.loginRequiredSend"));
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch(`${API_BASE}/soporte/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asunto, mensaje }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === "ok") {
        setEnviado(true);
        setAsunto("");
        setMensaje("");
        toast.success(t("support.toasts.sentOk"));
        obtenerMensajes();
      } else {
        toast.error(data.message || t("support.toasts.sendError"));
      }
    } catch (err) {
      console.error("Error en soporte/crear:", err);
      toast.error(t("support.toasts.serverError"));
    }
  };

  if (!authReady) return <p style={{ padding: 20 }}>{t("support.loadingSession")}</p>;
  if (!user) return null;

  return (
    <>
      <Header />

      <div className="soporte-page">
        <div className="soporte-container">
          <div className="soporte-wrap">
            <section className="soporte-left">
              <h2 className="titulo">{t("support.title")}</h2>

              <p className="soporte-subtitle">{t("support.subtitle")}</p>

              <p className="soporte-text">{t("support.text1.before")} <strong>PLANZO</strong> {t("support.text1.after")}</p>

              <p className="soporte-text">{t("support.text2")}</p>

              {enviado && (
                <p className="mensaje-exito">
                  {t("support.successMessage")}
                </p>
              )}
            </section>

            <section className="soporte-right">
              <form onSubmit={handleSubmit} className="espaciado-form">
                <input
                  type="text"
                  placeholder={t("support.form.subject")}
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="campo"
                  required
                />

                <textarea
                  placeholder={t("support.form.message")}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="campo"
                  rows="6"
                  required
                />

                <button type="submit" className="boton">
                  {t("support.form.send")}
                </button>
              </form>
            </section>
          </div>

          {mensajes.length > 0 && (
            <div className="historial">
              <h3 className="subtitulo">{t("support.history.title")}</h3>
              {mensajes.map((m) => (
                <div key={m.id} className="mensaje-card">
                  <p>
                    <strong>{t("support.history.subjectLabel")}</strong> {m.asunto}
                  </p>
                  <p>
                    <strong>{t("support.history.messageLabel")}</strong> {m.mensaje}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
      <Footer />
    </>
  );
}

export default Soporte;