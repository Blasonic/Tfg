import React from 'react';
import EventoCard from './EventoCard';
import './Calendario.css';

const Eventos = ({ fecha, eventos, onClose }) => {
  const fechaLegible = new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const eventosOrdenados = eventos.sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h3 className="fecha-titulo">Eventos del {fechaLegible}</h3>

        {eventosOrdenados.length === 0 ? (
          <p>No hay eventos para este día.</p>
        ) : (
          eventosOrdenados.map(ev => (
            <EventoCard key={ev.id} evento={ev} />
          ))
        )}
      </div>
    </div>
  );
};

export default Eventos;
