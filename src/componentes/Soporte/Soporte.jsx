import { useState, useEffect } from "react";
import "./Soporte.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Soporte() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      console.log("🟡 useEffect → token:", token);
      console.log("🟡 useEffect → storedUser:", storedUser);

      if (!storedUser || !token) {
        toast.warning("Es necesario iniciar sesión para acceder al soporte.");
        setTimeout(() => navigate("/Login"), 2000);
        return;
      }

      setUser(storedUser);
      setEmail(storedUser.email);
      obtenerMensajes(storedUser.email);
    } catch {
      toast.error("Error al leer los datos de sesión.");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!user || !token) {
      toast.error("Debes iniciar sesión para enviar un mensaje.");
      console.error("❌ No hay token o usuario al enviar");
      return;
    }

    console.log("✅ Enviando mensaje con datos:");
    console.log("📧 Email:", email);
    console.log("📨 Asunto:", asunto);
    console.log("📝 Mensaje:", mensaje);
    console.log("🔐 Token:", token);

    try {
      const res = await fetch("http://localhost:3000/api/soporte/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asunto, mensaje }), // ← CORREGIDO aquí
      });

      console.log("📬 Respuesta HTTP status:", res.status);
      const data = await res.json();
      console.log("📦 Respuesta body:", data);

      if (res.ok && data.status === "ok") {
        setEnviado(true);
        setAsunto("");
        setMensaje("");
        obtenerMensajes(email);
      } else {
        toast.error(data.message || "Error al enviar el mensaje.");
      }
    } catch (err) {
      console.error("❌ Error en fetch POST /crear:", err);
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  const obtenerMensajes = async (email) => {
    try {
      const res = await fetch("http://localhost:3000/api/soporte/lista");
      const data = await res.json();
      const filtrados = data.filter((m) => m.correo === email);
      console.log("📥 Mensajes del historial:", filtrados);
      setMensajes(filtrados);
    } catch (err) {
      console.error("❌ Error al obtener historial:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="soporte-container">
        <div className="formulario">
          <h2 className="titulo">Soporte</h2>
          {enviado && <p className="mensaje-exito">Tu mensaje ha sido enviado.</p>}

          {user && (
            <form onSubmit={handleSubmit} className="espaciado-form">
              <div className="campo-grupo">
                <label className="label">Tu correo</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className="campo"
                />
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
          )}
        </div>

        {user && (
          <div className="historial">
            <h3 className="subtitulo">Tus Mensajes</h3>
            {mensajes.length === 0 ? (
              <p>No hay mensajes registrados con este correo.</p>
            ) : (
              mensajes.map((m) => (
                <div key={m.id} className="mensaje-card">
                  <p><strong>Correo:</strong> {m.correo}</p>
                  <p><strong>Asunto:</strong> {m.asunto}</p>
                  <p><strong>Mensaje:</strong> {m.mensaje}</p>
                  <p><strong>Enviado:</strong> {new Date(m.creado_en).toLocaleString()}</p>
                  {m.respuesta ? (
                    <p className="respuesta"><strong>Ver respuesta:</strong> {m.respuesta}</p>
                  ) : (
                    <p className="pendiente"><em>Esperando respuesta...</em></p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default Soporte;
