import React, { useEffect, useState } from 'react';
import './Admin.css';
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

function Admin({ token, user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verUsuarios, setVerUsuarios] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Limpiar la marca de admin logueado una vez se entra
    sessionStorage.removeItem("admin-just-logged");
  }, []);

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

  if (!user || user.email !== ADMIN_EMAIL) return null;
  if (loading) return <p className="text-center mt-8">Cargando solicitudes...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Solicitudes de Fiestas</h2>

      {verUsuarios ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Perfiles de Usuarios</h3>
          {usuarios.map(u => (
            <div key={u._id} className="flex items-center gap-4 p-4 border rounded-lg shadow">
              <img src={u.profilePicture || 'https://via.placeholder.com/50'} alt="perfil" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-500">@{u.user}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setVerUsuarios(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Volver a Solicitudes</button>
        </div>
      ) : (
        <>
          <button onClick={cargarUsuarios} className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Ver Usuarios
          </button>

          {solicitudes.length === 0 ? (
            <p className="text-center">No hay solicitudes pendientes.</p>
          ) : (
            <div className="grid gap-6">
              {solicitudes.map((evento) => (
                <div key={evento.id} className="p-5 border rounded-lg shadow-lg relative bg-white">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://source.unsplash.com/100x100/?festival"
                      alt="fiesta"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{evento.titulo}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{evento.descripcion}</p>
                      <p className="text-sm mt-1"><strong>Fecha:</strong> {evento.fecha} - <strong>Hora:</strong> {evento.hora}</p>
                    </div>
                  </div>

                  {!selected || selected !== evento.id ? (
                    <button
                      onClick={() => setSelected(evento.id)}
                      className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
                    >
                      Ver más
                    </button>
                  ) : (
                    <div className="mt-4">
                      <p><strong>Tipo:</strong> {evento.tipo}</p>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => actualizarEstado(evento.id, 'aceptar')}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => actualizarEstado(evento.id, 'rechazar')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => setSelected(null)}
                          className="ml-auto text-sm text-gray-600 hover:underline"
                        >
                          Ocultar
                        </button>
                      </div>
                    </div>
                  )}
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