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

  const toggleExpandido = () => setExpandido(!expandido);

  return (
    <div className={`evento-card ${evento.tipo} ${expandido ? 'expandido' : ''}`} onClick={toggleExpandido}>
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

      <div className="evento-imagen-wrapper">
        <img
          src={evento.imagen || '/imagenes/default-evento.jpg'}
          alt={evento.titulo}
          className="evento-imagen-lateral"
        />
      </div>

      <div className="evento-info-lateral">
        <h4>{evento.titulo}</h4>
        <p className="evento-descripcion">{evento.descripcion}</p>
        <p><strong>Fecha:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()} {evento.fecha_fin && ` - ${new Date(evento.fecha_fin).toLocaleDateString()}`}</p>
        {horaFormateada && <p><strong>Hora:</strong> {horaFormateada}</p>}
      </div>

      {expandido && (
        <button className="cerrar-expandido" onClick={(e) => { e.stopPropagation(); setExpandido(false); }}>
          Cerrar
        </button>
      )}
    </div>
  );
};

export default EventoCard;
