import React, { useEffect, useState } from 'react';
import './Calendario.css';

const EventoCard = ({ evento }) => {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState('');
  const [comentariosExpandido, setComentariosExpandido] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('user'));
  const esCreador = usuario?.id === evento.creado_por;
  const mostrarCreador = evento.creador_rol === 'user';

  const horaFormateada = evento.hora_inicio
    ? evento.hora_fin
      ? `${evento.hora_inicio} - ${evento.hora_fin}`
      : `${evento.hora_inicio}`
    : null;

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/fiestas/comentarios/por-evento/${evento.id}`);
        const data = await res.json();
        setComentarios(data);
      } catch (error) {
        console.error('Error cargando comentarios del evento:', error);
      }
    };
    cargarComentarios();
  }, [evento.id]);

  const enviarComentario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/fiestas/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fiesta_id: evento.id,
          estrellas: parseInt(estrellas),
          texto: comentario,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComentario('');
        setEstrellas('');
        setMostrarFormulario(false);
        setComentarios(prev => [...prev, {
          autor_nombre: usuario.user,
          autor_avatar: usuario.profilePicture,
          estrellas: parseInt(estrellas),
          texto: comentario,
          fecha_creacion: new Date().toISOString()
        }]);
      } else {
        alert(data.message || 'Error al comentar');
      }
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  return (
    <div className={`evento-card-expandido ${evento.tipo}`} style={{ paddingBottom: '1rem' }}>
      <img
        src={evento.imagen || '/imagenes/default-evento.jpg'}
        alt={evento.titulo}
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
      />

      <div className="evento-info-lateral" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>{evento.titulo}</h4>
          {mostrarCreador && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={evento.creador_foto || '/imagenes/default-user.jpg'}
                alt={evento.creador_nombre}
                style={{ width: 30, height: 30, borderRadius: '50%' }}
              />
              <span style={{ fontWeight: 500 }}>{evento.creador_nombre}</span>
            </div>
          )}
        </div>

        <p className="evento-descripcion">{evento.descripcion}</p>
        <p><strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()} - {new Date(evento.fecha_fin).toLocaleDateString()}</p>
        {horaFormateada && <p><strong>Hora:</strong> {horaFormateada}</p>}
        <p><strong>Tipo:</strong> {evento.tipo}</p>
        {evento.direccion && <p><strong>Dirección:</strong> {evento.direccion}</p>}
        {evento.provincia && <p><strong>Provincia:</strong> {evento.provincia}</p>}
      </div>

      <div className="comentarios-seccion" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h4>Comentarios</h4>
            {comentarios.length === 0 ? (
              <p>No hay comentarios aún.</p>
            ) : (
              comentarios.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setComentariosExpandido(comentariosExpandido === i ? null : i)}
                  style={{
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={c.autor_avatar || '/imagenes/default-user.jpg'} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                    <strong>{c.autor_nombre}</strong>
                  </div>
                  <div style={{ color: '#f4c542' }}>{'⭐'.repeat(c.estrellas)}</div>
                  {comentariosExpandido === i ? (
                    <p>{c.texto}</p>
                  ) : (
                    <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.texto}</p>
                  )}
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(c.fecha_creacion).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {!esCreador && usuario && (
            <div style={{ flex: 1, minWidth: '250px' }}>
              {!mostrarFormulario ? (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="btn-nuevo-evento"
                >
                  Comentar este evento
                </button>
              ) : (
                <form onSubmit={enviarComentario}>
                  <h4>Tu comentario</h4>
                  <select
                    value={estrellas}
                    onChange={(e) => setEstrellas(e.target.value)}
                    required
                  >
                    <option value="">Estrellas</option>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{'⭐'.repeat(n)}</option>
                    ))}
                  </select>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    required
                    rows={3}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  ></textarea>
                  <button type="submit" className="btn-nuevo-evento" style={{ marginTop: '0.5rem' }}>
                    Enviar
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventoCard;
