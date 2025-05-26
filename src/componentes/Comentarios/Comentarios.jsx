import React, { useEffect, useState } from 'react';
import './Comentarios.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ComentariosPanel = () => {
  const [tab, setTab] = useState('recibidos');
  const [recibidos, setRecibidos] = useState([]);
  const [enviados, setEnviados] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const parsedUser = user ? JSON.parse(user) : null;
    setUsuario(parsedUser);

    const cargarComentarios = async () => {
      try {
        if (parsedUser) {
          const [resRecibidos, resEnviados] = await Promise.all([
            fetch('http://localhost:3000/api/comentarios/mis-fiestas', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('http://localhost:3000/api/comentarios/enviados', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          const dataRecibidos = await resRecibidos.json();
          const dataEnviados = await resEnviados.json();

          setRecibidos(Array.isArray(dataRecibidos) ? dataRecibidos : []);
          setEnviados(Array.isArray(dataEnviados) ? dataEnviados : []);
        } else {
          // Cargar los comentarios top si no hay usuario
          const resTop = await fetch('http://localhost:3000/api/comentarios/top');
          const dataTop = await resTop.json();
          setRecibidos(Array.isArray(dataTop) ? dataTop : []);
        }
      } catch (error) {
        console.error('Error cargando comentarios:', error);
      }
    };

    cargarComentarios();
  }, []);

  const calcularResumen = (comentarios) => {
    const total = comentarios.length;
    const suma = comentarios.reduce((acc, c) => acc + c.estrellas, 0);
    const media = total > 0 ? (suma / total).toFixed(1) : 0;

    const conteo = [1, 2, 3, 4, 5].map((n) => ({
      estrellas: `${n} ⭐`,
      cantidad: comentarios.filter((c) => c.estrellas === n).length
    }));

    return { total, media, conteo };
  };

  const resumen = calcularResumen(recibidos);

  const renderComentarios = (lista, tipo) => {
    if (!Array.isArray(lista) || lista.length === 0) {
      return <p>No hay comentarios {tipo === 'recibidos' ? 'recibidos' : 'enviados'}.</p>;
    }

    return lista.map((comentario) => (
      <div key={comentario.id} className="comentario-card">
        <img
          src={
            tipo === 'recibidos'
              ? comentario.autor_avatar || '/imagenes/default-user.jpg'
              : usuario?.profilePicture || '/imagenes/default-user.jpg'
          }
          alt="avatar"
          className="comentario-avatar"
        />
        <div className="comentario-contenido">
          <h4>{comentario.titulo_fiesta}</h4>
          {tipo === 'recibidos' && <p><strong>De:</strong> {comentario.autor_nombre}</p>}
          <p>{comentario.texto}</p>
          <div className="comentario-estrellas">{'⭐'.repeat(comentario.estrellas)}</div>
          <div className="comentario-fecha">
            {new Date(comentario.fecha_creacion).toLocaleString()}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="comentarios-panel">
      <h2>📝 Comentarios</h2>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#444' }}>
        {resumen.total > 0 ? (
          <>
            <p style={{ fontSize: '1.1rem' }}>
              ⭐ Valoración promedio: <strong>{resumen.media}</strong> / 5
            </p>
            <p>Total de comentarios: <strong>{resumen.total}</strong></p>
            <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumen.conteo} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estrellas" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#A7C4B2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p style={{ fontSize: '1rem' }}>Aún no hay valoraciones.</p>
        )}
      </div>

      {usuario && (
        <div className="comentarios-tabs">
          <button
            className={tab === 'recibidos' ? 'tab-activa' : ''}
            onClick={() => setTab('recibidos')}
          >
            Recibidos
          </button>
          <button
            className={tab === 'enviados' ? 'tab-activa' : ''}
            onClick={() => setTab('enviados')}
          >
            Enviados
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {usuario
          ? tab === 'recibidos'
            ? renderComentarios(recibidos, 'recibidos')
            : renderComentarios(enviados, 'enviados')
          : renderComentarios(recibidos, 'recibidos')}
      </div>
    </div>
  );
};

export default ComentariosPanel;
