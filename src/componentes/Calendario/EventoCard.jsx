import React from 'react';
import './Calendario.css';

const EventoCard = ({ evento }) => {
  return (
    <div className="evento-card">
      <img
        src={evento.imagen || '/imagenes/default-evento.jpg'}
        alt={evento.titulo}
        className="evento-imagen"
      />
      <div className="evento-info">
        <h4>{evento.titulo}</h4>
        <p><strong>Hora:</strong> {evento.hora}</p>
        <p><strong>Tipo:</strong> {evento.tipo}</p>
        <p className="evento-descripcion">{evento.descripcion}</p>
      </div>
    </div>
  );
};

export default EventoCard;
