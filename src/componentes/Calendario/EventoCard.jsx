import React, { useEffect, useState } from 'react';
import './Calendario.css';

const EventoCard = ({ evento }) => {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(0);

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
        setComentarios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando comentarios del evento:', error);
      }
    };
    cargarComentarios();
  }, [evento.id]);

  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!estrellas) {
      alert('Selecciona una cantidad de estrellas.');
      return;
    }

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
        const nuevoComentario = {
          autor_nombre: usuario.user,
          autor_avatar: usuario.profilePicture,
          estrellas: parseInt(estrellas),
          texto: comentario,
          fecha_creacion: new Date().toISOString()
        };

        setComentarios(prev => Array.isArray(prev) ? [...prev, nuevoComentario] : [nuevoComentario]);
        setComentario('');
        setEstrellas(0);
        setMostrarFormulario(false);
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

      <div className="comentarios-seccion" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn-nuevo-evento" onClick={() => setMostrarComentarios(true)}>
          Ver comentarios ({comentarios.length})
        </button>

        {!esCreador && usuario && (
          <button className="btn-nuevo-evento" onClick={() => setMostrarFormulario(true)}>
            Comentar este evento
          </button>
        )}
      </div>

      {/* Modal de comentarios */}
      {mostrarComentarios && (
        <div className="modal-comentarios-overlay">
          <div className="modal-comentarios-contenido">
            <button className="cerrar-modal" onClick={() => setMostrarComentarios(false)}>✖</button>
            <h3>Comentarios del evento</h3>
            {comentarios.length === 0 ? (
              <p>No hay comentarios aún.</p>
            ) : (
              comentarios.map((c, i) => (
                <div key={i} style={{ borderBottom: '1px solid #ddd', marginBottom: '1rem', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={c.autor_avatar || '/imagenes/default-user.jpg'} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                    <strong>{c.autor_nombre}</strong>
                  </div>
                  <div style={{ color: '#f4c542' }}>{'⭐'.repeat(c.estrellas)}</div>
                  <p>{c.texto}</p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(c.fecha_creacion).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de formulario para comentar */}
      {mostrarFormulario && (
        <div className="modal-comentarios-overlay">
          <div className="modal-comentarios-contenido">
            <button className="cerrar-modal" onClick={() => setMostrarFormulario(false)}>✖</button>
            <h3>Tu comentario</h3>
            <form onSubmit={enviarComentario}>
              <div className="estrellas-selector" style={{ marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    onClick={() => setEstrellas(n)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.8rem',
                      color: n <= estrellas ? '#f4c542' : '#ccc',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe tu comentario..."
                required
                rows={4}
                style={{ width: '100%', marginTop: '0.5rem' }}
              ></textarea>

              <button type="submit" className="btn-nuevo-evento" style={{ marginTop: '1rem' }}>
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventoCard;
