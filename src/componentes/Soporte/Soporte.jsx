import { useEffect, useState } from "react";
import "./Soporte.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

function Soporte() {
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
        toast.warning("Es necesario iniciar sesión para acceder al soporte.");
        setTimeout(() => navigate("/Login"), 1200);
      }
    });

    return () => unsub();
  }, [navigate]);

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
      toast.error("Debes iniciar sesión para enviar un mensaje.");
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
        toast.success("Mensaje enviado correctamente ✅");
        obtenerMensajes();
      } else {
        toast.error(data.message || "Error al enviar el mensaje.");
      }
    } catch (err) {
      console.error("Error en soporte/crear:", err);
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  if (!authReady) return <p style={{ padding: 20 }}>Cargando sesión...</p>;
  if (!user) return null;

  return (
    <>
      <Header />

      <div className="soporte-page">
        <div className="soporte-container">
          <div className="soporte-wrap">

            {/* IZQUIERDA */}
            <section className="soporte-left">
              <h2 className="titulo">Soporte técnico</h2>

              <p className="soporte-subtitle">
                Si algo no funciona como debería, estamos aquí para ayudarte.
              </p>

              <p className="soporte-text">
                En PLANZO trabajamos para que la tecnología sea un medio, no un problema.
                Este espacio está pensado para resolver incidencias técnicas de forma rápida,
                sencilla y eficaz, para que puedas seguir disfrutando de la plataforma sin
                interrupciones.
              </p>

              <p className="soporte-text">
                ⚙️ ¿Qué tipo de incidencias resolvemos? Problemas de acceso a tu cuenta,
                errores en reservas o pagos, dificultades para acceder a cursos o contenidos,
                fallos de carga o visualización e incidencias al publicar o gestionar eventos.
              </p>

              {enviado && (
                <p className="mensaje-exito">
                  Tu mensaje ha sido enviado correctamente.
                </p>
              )}
            </section>

            {/* DERECHA */}
            <section className="soporte-right">
              <form onSubmit={handleSubmit} className="espaciado-form">
                <input
                  type="text"
                  placeholder="ASUNTO"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="campo"
                  required
                />

                <textarea
                  placeholder="MENSAJE"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="campo"
                  rows="6"
                  required
                />

                <button type="submit" className="boton">
                  ENVIAR
                </button>
              </form>
            </section>

          </div>

          {/* HISTORIAL */}
          {mensajes.length > 0 && (
            <div className="historial">
              <h3 className="subtitulo">Mensajes anteriores</h3>
              {mensajes.map((m) => (
                <div key={m.id} className="mensaje-card">
                  <p><strong>Asunto:</strong> {m.asunto}</p>
                  <p><strong>Mensaje:</strong> {m.mensaje}</p>
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