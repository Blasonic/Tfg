// src/componentes/Admin/Admin.jsx
import React, { useEffect, useState } from "react";
import "./Admin.css";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:3000/api";

function Admin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verMensajes, setVerMensajes] = useState(false);

  const [isAdmin, setIsAdmin] = useState(null); // null = comprobando

  const getAuthHeaders = async (forceRefresh = false) => {
    const u = auth.currentUser;
    if (!u) throw new Error("No autenticado");
    const token = await u.getIdToken(forceRefresh);
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const run = async () => {
      try {
        const u = auth.currentUser;
        if (!u) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const tokenResult = await u.getIdTokenResult(true);
        const adminClaim = tokenResult?.claims?.admin === true;
        setIsAdmin(adminClaim);

        if (!adminClaim) {
          setLoading(false);
          return;
        }

        const headers = await getAuthHeaders(false);
        const res = await fetch(`${API_BASE}/fiestas/pendientes`, { headers });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) throw new Error(data?.message || "Error cargando pendientes");

        setSolicitudes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const actualizarEstado = async (id, accion) => {
    try {
      const headers = await getAuthHeaders(false);

      let url = "";
      let method = "";

      if (accion === "aceptar") {
        url = `${API_BASE}/fiestas/aceptar/${id}`;
        method = "PUT";
      } else {
        url = `${API_BASE}/fiestas/${id}`;
        method = "DELETE";
      }

      const res = await fetch(url, { method, headers });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result?.message || `Error al ${accion}`);

      setSolicitudes((prev) => prev.filter((ev) => ev.id !== id));
    } catch (error) {
      console.error(`❌ Error al ${accion} evento`, error);
    }
  };

  const cargarMensajes = async () => {
    try {
      const headers = await getAuthHeaders(false);

      // IMPORTANTE: esta es la ruta correcta de soporte (según tu diseño)
      const res = await fetch(`${API_BASE}/soporte/lista`, { headers });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Error cargando soporte");

      // admite {items: []} o [] directamente
      const items = Array.isArray(data) ? data : data.items || [];
      setMensajes(items);

      setVerMensajes(true);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      setMensajes([]);
      setVerMensajes(true);
    }
  };

  const responderMensaje = async (id, respuesta) => {
    try {
      const headers = await getAuthHeaders(false);

      const res = await fetch(`${API_BASE}/soporte/responder`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ id, respuesta }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Error respondiendo soporte");

      setMensajes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, respuesta, status: "answered" } : m))
      );
    } catch (err) {
      console.error("Error al responder:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando...</p>;
  if (!auth.currentUser) return <Navigate to="/Login" />;
  if (isAdmin === false) return <Navigate to="/" />;

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Panel de Administración</h2>

      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button onClick={handleLogout} className="btn btn-reject">
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={cargarMensajes} className="btn btn-toggle">
          Ver Mensajes de Soporte
        </button>
        <button
          onClick={() => setVerMensajes(false)}
          className="btn btn-toggle"
        >
          Ver Solicitudes
        </button>
      </div>

      {verMensajes ? (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>
            Mensajes de Soporte
          </h3>

          {mensajes.length === 0 ? (
            <p className="text-center">No hay mensajes (o tu backend aún no expone /soporte/lista).</p>
          ) : (
            mensajes.map((m) => (
              <div key={m.id} className="event-card">
                <p><strong>User UID:</strong> {m.user_uid || m.uid || "-"}</p>
                <p><strong>Asunto:</strong> {m.asunto}</p>
                <p><strong>Mensaje:</strong> {m.mensaje}</p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                </p>

                {m.respuesta ? (
                  <p className="text-green-600 mt-2">
                    <strong>Respuesta enviada:</strong> {m.respuesta}
                  </p>
                ) : (
                  <ResponderSimple onResponder={(res) => responderMensaje(m.id, res)} />
                )}
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>
            Solicitudes de Fiestas
          </h3>

          {Array.isArray(solicitudes) && solicitudes.length > 0 ? (
            <div className="grid gap-6">
              {solicitudes.map((evento) => (
                <div key={evento.id} className="event-card">
                  <img
                    src={evento.imagen || "https://source.unsplash.com/100x100/?festival"}
                    alt="fiesta"
                    className="event-image"
                  />
                  <div className="event-info">
                    <h3 className="text-lg font-bold">{evento.titulo}</h3>
                    <p className="text-gray-600 text-sm">{evento.descripcion}</p>

                    <p className="text-sm mt-1">
                      <strong>Inicio:</strong>{" "}
                      {evento.start_at ? new Date(evento.start_at).toLocaleString() : ""}
                    </p>

                    <p><strong>Categoría:</strong> {evento.categoria || evento.tipo}</p>
                  </div>

                  <div className="event-actions">
                    <button
                      onClick={() => actualizarEstado(evento.id, "aceptar")}
                      className="btn btn-accept"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => actualizarEstado(evento.id, "rechazar")}
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
    onResponder(respuesta.trim());
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