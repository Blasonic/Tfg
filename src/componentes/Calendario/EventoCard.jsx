import React from 'react';
import './Calendario.css';

const EventoCard = ({ evento }) => {
  const mostrarCreador = evento.creador_rol === 'user';

  const horaFormateada = evento.hora_inicio
    ? evento.hora_fin
      ? `${evento.hora_inicio} - ${evento.hora_fin}`
      : `${evento.hora_inicio}`
    : 'Todo el día';

  return (
    <div className={`evento-card ${evento.tipo}`}>
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
        <p><strong>Hora:</strong> {horaFormateada}</p>
        <p><strong>Tipo:</strong> {evento.tipo}</p>
        <p className="evento-descripcion">{evento.descripcion}</p>
      </div>
    </div>
  );
};

export default EventoCard;
