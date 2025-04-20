import React, { useEffect, useState } from 'react';
import './Admin.css';
 import { Navigate } from 'react-router-dom';
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

function Admin({ token, user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verUsuarios, setVerUsuarios] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    fetch('http://localhost:3000/api/fiestas/pendientes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSolicitudes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar solicitudes:', err);
        setLoading(false);
      });
  }, [token, user]);

  const actualizarEstado = async (id, accion) => {
    const url = `http://localhost:3000/api/fiestas/${accion}/${id}`;
    try {
      await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSolicitudes(solicitudes.filter(ev => ev.id !== id));
      setSelected(null);
    } catch (error) {
      console.error(`Error al ${accion} evento`, error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(data);
      setVerUsuarios(true);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const handleLogout = () => {
    // Limpia todo
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin-just-logged");
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
  
    // Redirige a login
    window.location.href = "/";
  };
  
  

  if (!user) return <Navigate to="/Login" />;
  if (!ADMIN_EMAIL) return <p>Error: admin email no definido</p>;
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" />;

  if (loading) return <p className="text-center mt-8">Cargando solicitudes...</p>;

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Solicitudes de Fiestas</h2>

      {/* Botón de logout */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={handleLogout}
          className="btn btn-reject"
        >
          Cerrar sesión
        </button>
      </div>

      {verUsuarios ? (
        <>
          <h3 className="admin-title" style={{ fontSize: "1.5rem" }}>Perfiles de Usuarios</h3>
          {usuarios.map(u => (
            <div key={u._id} className="user-card">
              <img src={u.profilePicture || 'https://via.placeholder.com/50'} alt="perfil" className="user-avatar" />
              <div className="user-info">
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">@{u.user}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setVerUsuarios(false)} className="btn btn-toggle">
            Volver a Solicitudes
          </button>
        </>
      ) : (
        <>
          <button onClick={cargarUsuarios} className="btn btn-toggle">
            Ver Usuarios
          </button>

          {solicitudes.length === 0 ? (
            <p className="text-center">No hay solicitudes pendientes.</p>
          ) : (
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
                      <strong>Fecha:</strong> {evento.fecha} - <strong>Hora:</strong> {evento.hora}
                    </p>

                    {selected === evento.id && (
                      <div className="event-actions">
                        <p><strong>Tipo:</strong> {evento.tipo}</p>
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
                        <button
                          onClick={() => setSelected(null)}
                          className="btn btn-secondary"
                        >
                          Ocultar
                        </button>
                      </div>
                    )}
                  </div>

                  {!selected || selected !== evento.id ? (
                    <button
                      onClick={() => setSelected(evento.id)}
                      className="btn btn-secondary"
                      style={{ marginLeft: "auto" }}
                    >
                      Ver más
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
