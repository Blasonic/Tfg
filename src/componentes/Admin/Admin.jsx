import React, { useEffect, useState } from 'react';
import './Admin.css';
import { Navigate } from 'react-router-dom';

function Admin() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const token = localStorage.getItem("token");

  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verUsuarios, setVerUsuarios] = useState(false);
  const [verMensajes, setVerMensajes] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    fetch('http://localhost:3000/api/fiestas/pendientes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSolicitudes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar solicitudes:', err);
        setLoading(false);
      });
  }, [token, user]);

  const actualizarEstado = async (id, accion) => {
    let url = '';
    let method = '';

    if (accion === 'aceptar') {
      url = `http://localhost:3000/api/fiestas/aceptar/${id}`;
      method = 'PUT';
    } else if (accion === 'rechazar') {
      url = `http://localhost:3000/api/fiestas/${id}`;
      method = 'DELETE';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      setSolicitudes(prev => prev.filter(ev => ev.id !== id));
    } catch (error) {
      console.error(`❌ Error al ${accion} evento`, error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(data);
      setVerUsuarios(true);
      setVerMensajes(false);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const cargarMensajes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/fiestas/lista');
      const data = await res.json();
      setMensajes(data);
      setVerMensajes(true);
      setVerUsuarios(false);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  const responderMensaje = async (id, respuesta) => {
    try {
      await fetch("http://localhost:3000/api/soporte/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, respuesta }),
      });
      setMensajes(prev =>
        prev.map(m => (m.id === id ? { ...m, respuesta } : m))
      );
    } catch (err) {
      console.error("Error al responder:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) return <Navigate to="/Login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  if (loading) return <p className="text-center mt-8">Cargando solicitudes...</p>;

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Panel de Administración</h2>

      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button onClick={handleLogout} className="btn btn-reject">Cerrar sesión</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={cargarUsuarios} className="btn btn-toggle">Ver Usuarios</button>
        <button onClick={cargarMensajes} className="btn btn-toggle">Ver Mensajes de Soporte</button>
        <button onClick={() => { setVerUsuarios(false); setVerMensajes(false); }} className="btn btn-toggle">Ver Solicitudes</button>
      </div>

      {verUsuarios && (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>Perfiles de Usuarios</h3>
          {usuarios.map(u => (
            <div key={u._id || u.id} className="user-card">
              <img src={u.profilePicture || 'https://via.placeholder.com/50'} alt="perfil" className="user-avatar" />
              <div className="user-info">
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">@{u.user}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {verMensajes && (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>Mensajes de Soporte</h3>
          {mensajes.map(m => (
            <div key={m.id} className="event-card">
              <p><strong>Correo:</strong> {m.correo}</p>
              <p><strong>Asunto:</strong> {m.asunto}</p>
              <p><strong>Mensaje:</strong> {m.mensaje}</p>
              <p><strong>Fecha:</strong> {new Date(m.creado_en).toLocaleString()}</p>
              {m.respuesta ? (
                <p className="text-green-600 mt-2"><strong>Respuesta enviada:</strong> {m.respuesta}</p>
              ) : (
                <ResponderSimple onResponder={(res) => responderMensaje(m.id, res)} />
              )}
            </div>
          ))}
          <button onClick={() => setVerMensajes(false)} className="btn btn-toggle">
            Volver a Solicitudes
          </button>
        </>
      )}

      {!verUsuarios && !verMensajes && (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>Solicitudes de Fiestas</h3>
          {Array.isArray(solicitudes) && solicitudes.length > 0 ? (
            <div className="grid gap-6">
              {solicitudes.map((evento) => (
                <div key={evento.id} className="event-card">
                  <img
                    src="https://source.unsplash.com/100x100/?festival"
                    alt="fiesta"
                    className="event-image"
                  />
                  <div className="event-info">
                    <h3 className="text-lg font-bold">{evento.titulo}</h3>
                    <p className="text-gray-600 text-sm">{evento.descripcion}</p>
                    <p className="text-sm mt-1">
                      <strong>Fecha:</strong> {evento.fecha_inicio} - <strong>Hora:</strong> {evento.hora_inicio}
                    </p>
                    <p><strong>Tipo:</strong> {evento.tipo}</p>
                  </div>
                  <div className="event-actions">
                    <button
                      onClick={() => actualizarEstado(evento.id, 'aceptar')}
                      className="btn btn-accept"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => actualizarEstado(evento.id, 'rechazar')}
                      className="btn btn-reject"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay solicitudes pendientes.</p>
          )}
        </>
      )}
    </div>
  );
}

function ResponderSimple({ onResponder }) {
  const [respuesta, setRespuesta] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    if (!respuesta.trim()) return;
    onResponder(respuesta);
    setRespuesta("");
  };

  return (
    <form onSubmit={enviar} className="mt-2">
      <textarea
        placeholder="Escribe una respuesta..."
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        rows="3"
        required
      />
      <button type="submit" className="btn btn-accept">
        Enviar Respuesta
      </button>
    </form>
  );
}

export default Admin;
