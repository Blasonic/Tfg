import { useState } from "react";
import "./Soporte.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Soporte() {
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/api/soporte/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, asunto, mensaje }),
    });
    setEnviado(true);
    setAsunto("");
    setMensaje("");
    obtenerMensajes();
  };

  const obtenerMensajes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/soporte/lista");
      const data = await res.json();
      const filtrados = data.filter(m => m.correo === correo.trim());
      setMensajes(filtrados);
      setMostrarHistorial(true);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    }
  };

  return (
     <>
    <div className="soporte-container">
        <Header />
      <div className="formulario">
        <h2 className="titulo">Soporte</h2>
        {enviado && <p className="mensaje-exito">Tu mensaje ha sido enviado.</p>}

        <form onSubmit={handleSubmit} className="espaciado-form">
          <input
            type="email"
            placeholder="Tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="campo"
            required
          />
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

        {correo && (
          <button onClick={obtenerMensajes} className="boton ver-historial">
            Ver historial de mensajes
          </button>
        )}
      </div>

      {mostrarHistorial && (
        <div className="historial">
          <h3 className="subtitulo">Tus Mensajes</h3>
          {mensajes.length === 0 ? (
            <p>No hay mensajes registrados con este correo.</p>
          ) : (
            mensajes.map((m) => (
              <div key={m.id} className="mensaje-card">
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
<Footer /></>
  );
}

export default Soporte;
