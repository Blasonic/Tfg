import React, { useState } from 'react';
import './Calendario.css';

const EventoCard = ({ evento }) => {
  const [expandido, setExpandido] = useState(false);
  const mostrarCreador = evento.creador_rol === 'user';

  const horaFormateada = evento.hora_inicio
    ? evento.hora_fin
      ? `${evento.hora_inicio} - ${evento.hora_fin}`
      : `${evento.hora_inicio}`
    : null;

  return (
    <>
      <div className={`evento-card ${evento.tipo}`} onClick={() => setExpandido(true)}>
        {mostrarCreador && (
          <div className="evento-creador-superior">
            <img
              src={evento.creador_foto || '/imagenes/default-user.jpg'}
              alt={evento.creador_nombre}
              className="creador-avatar-superior"
            />
            <span className="creador-nombre-superior">{evento.creador_nombre}</span>
          </div>
        )}

        <img
          src={evento.imagen || '/imagenes/default-evento.jpg'}
          alt={evento.titulo}
          className="evento-imagen-lateral"
        />

        <div className="evento-info-lateral">
          <h4>{evento.titulo}</h4>
          <p className="evento-descripcion">{evento.descripcion}</p>
          <p><strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()} - {new Date(evento.fecha_fin).toLocaleDateString()}</p>
          {horaFormateada && <p><strong>Hora:</strong> {horaFormateada}</p>}
        </div>
      </div>

      {expandido && (
        <div className="evento-modal" onClick={() => setExpandido(false)}>
          <div className="evento-modal-content" onClick={e => e.stopPropagation()}>
            <button className="cerrar-expandido" onClick={() => setExpandido(false)}>✕</button>

            {mostrarCreador && (
              <div className="evento-creador-superior">
                <img
                  src={evento.creador_foto || '/imagenes/default-user.jpg'}
                  alt={evento.creador_nombre}
                  className="creador-avatar-superior"
                />
                <span className="creador-nombre-superior">{evento.creador_nombre}</span>
              </div>
            )}

            <img
              src={evento.imagen || '/imagenes/default-evento.jpg'}
              alt={evento.titulo}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
            />

            <div className="evento-info-lateral" style={{ padding: '1rem' }}>
              <h4>{evento.titulo}</h4>
              <p className="evento-descripcion">{evento.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()} - {new Date(evento.fecha_fin).toLocaleDateString()}</p>
              {horaFormateada && <p><strong>Hora:</strong> {horaFormateada}</p>}
              <p><strong>Tipo:</strong> {evento.tipo}</p>
              {evento.direccion && <p><strong>Dirección:</strong> {evento.direccion}</p>}
              {evento.provincia && <p><strong>Provincia:</strong> {evento.provincia}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventoCard;
