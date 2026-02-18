import { useEffect, useState } from "react";
import "./Soporte.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // ajusta la ruta

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000/api";


function Soporte() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  // ⚠️ Historial: con tu backend actual /lista suele ser admin.
  // Lo dejo, pero si te da 403/401, hay que crear endpoint /mis
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
      // Si tu /lista es admin, esto fallará.
      // Lo correcto es un endpoint /soporte/mis (auth) que devuelva solo del uid.
      const res = await fetch(`${API_BASE}/soporte/lista`);
      if (!res.ok) return;
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al obtener historial:", err);
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
        toast.success("Mensaje enviado ✅");
        obtenerMensajes();
      } else {
        toast.error(data.message || "Error al enviar el mensaje.");
      }
    } catch (err) {
      console.error("❌ Error en POST soporte/crear:", err);
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  if (!authReady) return <p style={{ padding: 20 }}>Cargando sesión...</p>;
  if (!user) return null; // ya redirige

  return (
    <>
      <Header />

      <div className="soporte-container">
        <div className="formulario">
          <h2 className="titulo">Soporte</h2>
          {enviado && <p className="mensaje-exito">Tu mensaje ha sido enviado.</p>}

          <form onSubmit={handleSubmit} className="espaciado-form">
            <div className="campo-grupo">
              <label className="label">Tu correo</label>
              <input type="email" value={email} readOnly disabled className="campo" />
            </div>

            <input
              type="text"
              placeholder="Asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="campo"
              required
            />
            <textarea
              placeholder="Mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="campo"
              rows="5"
              required
            />
            <button type="submit" className="boton">Enviar</button>
          </form>
        </div>

        {/* Historial (si tu endpoint lo permite) */}
        {mensajes.length > 0 && (
          <div className="historial">
            <h3 className="subtitulo">Mensajes</h3>
            {mensajes.map((m) => (
              <div key={m.id} className="mensaje-card">
                <p><strong>Asunto:</strong> {m.asunto}</p>
                <p><strong>Mensaje:</strong> {m.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
      <Footer />
    </>
  );
}

export default Soporte;
